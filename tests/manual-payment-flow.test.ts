import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const paymentPage = readFileSync(join(root, "app/payment/page.tsx"), "utf8");
const submitRoute = readFileSync(join(root, "app/api/payment/submit/route.ts"), "utf8");
const adminRoute = readFileSync(join(root, "app/api/admin/payments/[paymentId]/route.ts"), "utf8");
const quizRoute = readFileSync(join(root, "app/api/quiz/[sessionToken]/route.ts"), "utf8");
const demoLeadRoute = readFileSync(join(root, "app/api/payment/demo/route.ts"), "utf8");
const migration = readFileSync(join(root, "supabase/migrations/202608280001_manual_bkash_payments.sql"), "utf8");

describe("manual bKash payment MVP", () => {
  it("renders the required launch offer and personal Send Money instructions", () => {
    expect(paymentPage).toContain("সম্পূর্ণ Relationship Analysis আনলক করুন");
    expect(paymentPage).toContain("🎉 প্রথম ৫০ জনের জন্য ৫০% Launch Discount");
    expect(paymentPage).toContain("৳{offer.regularAmount}");
    expect(paymentPage).toContain("line-through");
    expect(paymentPage).toContain("৳{offer.amount}");
    expect(paymentPage).toContain("bKash-এ Send Money করুন");
    expect(paymentPage).toContain("01953121121");
    expect(paymentPage).toContain("Payment verification pending");
  });

  it("submits only verification details and does not emit Meta purchase or lead from the pending submit", () => {
    expect(paymentPage).toContain("/api/payment/submit");
    expect(paymentPage).toContain("bkashTrxId");
    expect(paymentPage).toContain("senderMobileNumber");
    expect(paymentPage).not.toContain("trackMetaLead");
    expect(paymentPage).not.toContain("Purchase");
  });

  it("prevents obvious duplicate TrxID submissions and stores pending only", () => {
    expect(submitRoute).toContain(".eq(\"bkash_trx_id\", bkashTrxId)");
    expect(submitRoute).toContain("return errorResponse(\"এই TrxID আগে জমা দেওয়া হয়েছে।\", 409)");
    expect(submitRoute).toContain("status: \"pending\"");
    expect(submitRoute).not.toContain("is_unlocked: true");
  });

  it("unlocks reports only from a verified payment lookup", () => {
    expect(quizRoute).toContain(".from(\"payments\")");
    expect(quizRoute).toContain(".eq(\"status\", \"verified\")");
    expect(quizRoute).toContain("is_unlocked: Boolean(verifiedPayment)");
    expect(quizRoute).not.toContain("session.status === \"report_unlocked\"");
  });

  it("keeps admin verification token-protected and does not send Meta Purchase for launch", () => {
    expect(adminRoute).toContain("PAYMENT_ADMIN_TOKEN");
    expect(adminRoute).toContain("status: \"verified\"");
    expect(adminRoute).not.toContain("sendMetaPurchaseEvent");
    expect(adminRoute).not.toContain("Purchase");
  });

  it("keeps Meta Lead implementation in the existing demo route", () => {
    expect(demoLeadRoute).toContain("sendMetaLeadEvent(request, metaEventId)");
    expect(demoLeadRoute).toContain("crypto.randomUUID()");
  });

  it("has no Meta CAPI Purchase sender in the launch code", () => {
    expect(adminRoute).not.toContain("sendMetaPurchaseEvent");
    expect(paymentPage).not.toContain("trackMetaLead");
    expect(paymentPage).not.toContain("Purchase");
  });

  it("adds database constraints for duplicate TrxID and verified-only launch counting", () => {
    expect(migration).toContain("payments_bkash_trx_id_unique");
    expect(migration).toContain("upper(bkash_trx_id)");
    expect(migration).toContain("status in ('pending', 'verified')");
    expect(migration).toContain("status in ('pending', 'verified', 'rejected')");
  });
});
