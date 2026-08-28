import { errorResponse, jsonResponse } from "@/lib/api";
import { getCurrentPaymentAmount, normalizeTrxId, PAYMENT_CURRENCY } from "@/lib/payment";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { paymentSubmitSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = paymentSubmitSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const hasInvalidMobile = parsed.error.issues.some((issue) => issue.message === "INVALID_MOBILE");
    return errorResponse(hasInvalidMobile ? "সঠিক মোবাইল নম্বর দিন।" : "তথ্য সঠিক নয়।", 400);
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: session, error: sessionError } = await supabaseAdmin
    .from("quiz_sessions")
    .select("id")
    .eq("session_token", parsed.data.sessionToken)
    .single();

  if (sessionError || !session) return errorResponse("সেশন পাওয়া যায়নি।", 404);

  const bkashTrxId = normalizeTrxId(parsed.data.bkashTrxId);
  const { data: duplicate } = await supabaseAdmin.from("payments").select("id").eq("bkash_trx_id", bkashTrxId).maybeSingle();
  if (duplicate) return errorResponse("এই TrxID আগে জমা দেওয়া হয়েছে।", 409);

  const { data: verifiedPayment } = await supabaseAdmin.from("payments").select("id").eq("quiz_session_id", session.id).eq("status", "verified").maybeSingle();
  if (verifiedPayment) {
    return jsonResponse({ success: true, status: "verified" });
  }

  const { data: pendingPayment } = await supabaseAdmin
    .from("payments")
    .select("id, amount, currency, status, created_at")
    .eq("quiz_session_id", session.id)
    .eq("status", "pending")
    .maybeSingle();
  if (pendingPayment) return jsonResponse({ success: true, payment: pendingPayment });

  const amount = await getCurrentPaymentAmount(supabaseAdmin);
  const { data: payment, error } = await supabaseAdmin
    .from("payments")
    .insert({
      quiz_session_id: session.id,
      bkash_trx_id: bkashTrxId,
      sender_mobile: parsed.data.senderMobileNumber,
      amount,
      currency: PAYMENT_CURRENCY,
      status: "pending",
    })
    .select("id, amount, currency, status, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return errorResponse("এই TrxID আগে জমা দেওয়া হয়েছে।", 409);
    console.error("payments insert failed", error);
    return errorResponse("পেমেন্ট তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।", 500);
  }

  return jsonResponse({ success: true, payment });
}
