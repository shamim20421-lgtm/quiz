import { errorResponse, jsonResponse } from "@/lib/api";
import { getCurrentPaymentAmount, PAYMENT_CURRENCY } from "@/lib/payment";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { adminPaymentStatusSchema } from "@/lib/validation";

function isAuthorized(request: Request) {
  const token = process.env.PAYMENT_ADMIN_TOKEN;
  if (!token) return false;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  if (!isAuthorized(request)) return errorResponse("অনুমতি নেই।", 401);

  const parsed = adminPaymentStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("স্ট্যাটাস সঠিক নয়।", 400);

  const { paymentId } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from("payments")
    .select("id, quiz_session_id, status")
    .eq("id", paymentId)
    .single();

  if (paymentError || !payment) return errorResponse("পেমেন্ট পাওয়া যায়নি।", 404);
  if (payment.status === "verified") return jsonResponse({ success: true, status: "verified" });
  if (payment.status === "rejected") return jsonResponse({ success: true, status: "rejected" });

  if (parsed.data.status === "rejected") {
    const { error } = await supabaseAdmin
      .from("payments")
      .update({ status: "rejected", rejected_at: new Date().toISOString() })
      .eq("id", payment.id)
      .eq("status", "pending");

    if (error) {
      console.error("payment reject failed", error);
      return errorResponse("পেমেন্ট রিজেক্ট করা যায়নি।", 500);
    }

    return jsonResponse({ success: true, status: "rejected" });
  }

  const amount = await getCurrentPaymentAmount(supabaseAdmin);
  const verifiedAt = new Date().toISOString();
  const { error: verifyError } = await supabaseAdmin
    .from("payments")
    .update({
      status: "verified",
      amount,
      currency: PAYMENT_CURRENCY,
      verified_at: verifiedAt,
    })
    .eq("id", payment.id)
    .eq("status", "pending");

  if (verifyError) {
    console.error("payment verify failed", verifyError);
    return errorResponse("পেমেন্ট ভেরিফাই করা যায়নি।", 500);
  }

  await Promise.all([
    supabaseAdmin.from("reports").update({ is_unlocked: true }).eq("quiz_session_id", payment.quiz_session_id),
    supabaseAdmin.from("quiz_sessions").update({ status: "report_unlocked" }).eq("id", payment.quiz_session_id),
  ]);

  return jsonResponse({
    success: true,
    status: "verified",
    amount,
    currency: PAYMENT_CURRENCY,
    verifiedAt,
  });
}
