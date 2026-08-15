import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { earlyAccessSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = earlyAccessSchema.safeParse(await request.json().catch(() => null));
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

  const { error } = await supabaseAdmin.from("early_access_leads").insert({
    quiz_session_id: session.id,
    name: parsed.data.name,
    mobile: parsed.data.mobileNumber,
    feedback: parsed.data.feedback || null,
  });

  if (error) {
    console.error("early_access_leads insert failed", error);
    return errorResponse("তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।", 500);
  }

  return jsonResponse({ success: true });
}
