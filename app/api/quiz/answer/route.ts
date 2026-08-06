import { assessmentQuestions } from "@/lib/assessment/questions";
import { buildAnswerRecord } from "@/lib/assessment/answer-record";
import { errorResponse, jsonResponse } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { answerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = answerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("উত্তরটি সঠিকভাবে পাঠানো হয়নি।", 400);

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("quiz_sessions")
    .select("id")
    .eq("session_token", parsed.data.sessionToken)
    .single();

  if (sessionError || !session) return errorResponse("সেশন পাওয়া যায়নি। আবার শুরু করুন।", 404);

  const record = buildAnswerRecord(session.id, parsed.data.questionKey, parsed.data.answerKey);
  if (!record) return errorResponse("এই উত্তরটি গ্রহণ করা যায়নি।", 400);

  const { error } = await supabaseAdmin.from("quiz_answers").upsert(record, { onConflict: "quiz_session_id,question_key" });
  if (error) {
    console.error("quiz_answers upsert failed", error);
    return errorResponse("উত্তর সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।", 500);
  }

  const { count } = await supabaseAdmin
    .from("quiz_answers")
    .select("question_key", { count: "exact", head: true })
    .eq("quiz_session_id", session.id);

  return jsonResponse({ completionCount: count ?? 0, totalCount: assessmentQuestions.length });
}
