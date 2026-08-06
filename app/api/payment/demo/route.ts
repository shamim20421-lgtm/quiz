import { errorResponse, jsonResponse } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { demoPaymentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = demoPaymentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("পেমেন্ট তথ্য সঠিক নয়।", 400);

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("quiz_sessions")
    .select("id")
    .eq("session_token", parsed.data.sessionToken)
    .single();

  if (sessionError || !session) return errorResponse("সেশন পাওয়া যায়নি।", 404);

  const paymentPayloads: Record<string, unknown>[] = [
    {
      quiz_session_id: session.id,
      payer_name: parsed.data.name,
      mobile_number: parsed.data.mobileNumber,
      transaction_id: parsed.data.transactionId,
      status: "paid",
    },
    {
      quiz_session_id: session.id,
      payer_name: parsed.data.name,
      phone_number: parsed.data.mobileNumber,
      transaction_id: parsed.data.transactionId,
      status: "paid",
    },
    {
      quiz_session_id: session.id,
      name: parsed.data.name,
      phone_number: parsed.data.mobileNumber,
      transaction_id: parsed.data.transactionId,
      status: "paid",
    },
    {
      quiz_session_id: session.id,
      name: parsed.data.name,
      mobile: parsed.data.mobileNumber,
      transaction_id: parsed.data.transactionId,
      status: "paid",
    },
    {
      quiz_session_id: session.id,
      status: "paid",
    },
  ];

  let paymentError: unknown = null;
  for (const payload of paymentPayloads) {
    const upsertResult = await supabaseAdmin.from("payments").upsert(payload, { onConflict: "quiz_session_id" });
    if (!upsertResult.error) {
      paymentError = null;
      break;
    }
    paymentError = upsertResult.error;
    const insertResult = await supabaseAdmin.from("payments").insert(payload);
    paymentError = insertResult.error;
    if (!insertResult.error) {
      paymentError = null;
      break;
    }
  }

  if (paymentError) {
    console.error("payments upsert failed", paymentError);
    return errorResponse("ডেমো পেমেন্ট সংরক্ষণ করা যায়নি।", 500);
  }

  await supabaseAdmin.from("reports").update({ is_unlocked: true }).eq("quiz_session_id", session.id);
  await supabaseAdmin.from("quiz_sessions").update({ status: "report_unlocked" }).eq("id", session.id);

  return jsonResponse({ success: true });
}
