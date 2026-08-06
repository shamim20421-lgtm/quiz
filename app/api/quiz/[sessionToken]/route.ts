import { errorResponse, jsonResponse } from "@/lib/api";
import { getReportTemplate } from "@/lib/assessment/reports";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ResultType } from "@/lib/types";

export async function GET(_request: Request, { params }: { params: Promise<{ sessionToken: string }> }) {
  const { sessionToken } = await params;
  if (!sessionToken || sessionToken.length < 12) return errorResponse("সেশনটি সঠিক নয়।", 400);

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("quiz_sessions")
    .select("id, session_token, problem_type, status, score, result_type")
    .eq("session_token", sessionToken)
    .single();

  if (sessionError || !session) return errorResponse("সেশন পাওয়া যায়নি।", 404);

  const [{ data: answers }, { data: storedReport }] = await Promise.all([
    supabaseAdmin.from("quiz_answers").select("question_key, answer_key").eq("quiz_session_id", session.id),
    supabaseAdmin.from("reports").select("*").eq("quiz_session_id", session.id).maybeSingle(),
  ]);

  const safeSession: Record<string, unknown> = { ...session };
  delete safeSession.id;
  const template = session.result_type ? getReportTemplate(session.result_type as ResultType) : null;
  const generatedReport = template
    ? {
        ...(storedReport ?? {}),
        title: storedReport?.title ?? template.title,
        free_summary: storedReport?.free_summary ?? template.freeSummary,
        immediate_action: storedReport?.immediate_action ?? template.immediateAction,
        sample_message: storedReport?.sample_message ?? template.sampleMessage,
        full_summary: storedReport?.full_summary ?? template.fullSummary,
        communication_pattern: storedReport?.communication_pattern ?? template.communicationPattern,
        possible_reasons: storedReport?.possible_reasons ?? template.possibleReasons,
        action_plan: storedReport?.action_plan ?? template.actionPlan,
        mistakes_to_avoid: storedReport?.mistakes_to_avoid ?? template.mistakesToAvoid,
        suggested_conversation: storedReport?.suggested_conversation ?? template.suggestedConversation,
        relationship_insight: storedReport?.relationship_insight ?? template.relationshipInsight,
        suggested_messages: storedReport?.suggested_messages ?? template.suggestedMessages,
        is_unlocked: Boolean(storedReport?.is_unlocked) || session.status === "report_unlocked",
      }
    : storedReport;

  return jsonResponse({ session: safeSession, answers: answers ?? [], report: generatedReport });
}
