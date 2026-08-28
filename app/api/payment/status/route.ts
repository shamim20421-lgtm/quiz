import { errorResponse, jsonResponse } from "@/lib/api";
import { BKASH_PAYMENT_NUMBER, getCurrentPaymentAmount, PAYMENT_CURRENCY, REGULAR_PAYMENT_AMOUNT } from "@/lib/payment";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionToken = searchParams.get("sessionToken");
  if (!sessionToken || sessionToken.length < 12) return errorResponse("সেশনটি সঠিক নয়।", 400);

  const supabaseAdmin = getSupabaseAdmin();
  const { data: session, error: sessionError } = await supabaseAdmin
    .from("quiz_sessions")
    .select("id")
    .eq("session_token", sessionToken)
    .single();

  if (sessionError || !session) return errorResponse("সেশন পাওয়া যায়নি।", 404);

  const [{ data: payment }, amount] = await Promise.all([
    supabaseAdmin
      .from("payments")
      .select("id, amount, currency, status, created_at, verified_at")
      .eq("quiz_session_id", session.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getCurrentPaymentAmount(supabaseAdmin),
  ]);

  return jsonResponse({
    payment: payment ?? null,
    offer: {
      bkashNumber: BKASH_PAYMENT_NUMBER,
      amount,
      regularAmount: REGULAR_PAYMENT_AMOUNT,
      currency: PAYMENT_CURRENCY,
    },
  });
}
