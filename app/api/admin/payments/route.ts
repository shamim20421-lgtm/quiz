import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function isAuthorized(request: Request) {
  const token = process.env.PAYMENT_ADMIN_TOKEN;
  if (!token) return false;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return errorResponse("অনুমতি নেই।", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";
  if (!["pending", "verified", "rejected"].includes(status)) return errorResponse("স্ট্যাটাস সঠিক নয়।", 400);

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("id, quiz_session_id, bkash_trx_id, sender_mobile, amount, currency, status, created_at, verified_at, rejected_at")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("admin payments list failed", error);
    return errorResponse("পেমেন্ট তালিকা আনা যায়নি।", 500);
  }

  return jsonResponse({ payments: data ?? [] });
}
