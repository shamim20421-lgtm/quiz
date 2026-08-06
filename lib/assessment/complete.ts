import { assessmentQuestions } from "@/lib/assessment/questions";
import { getReportTemplate } from "@/lib/assessment/reports";
import { calculateScore, getResultType } from "@/lib/assessment/scoring";
import type { SavedAnswer } from "@/lib/types";

type SupabaseLike = {
  from: (table: string) => unknown;
};

type QueryStep = {
  select: (columns: string, options?: Record<string, unknown>) => QueryStep;
  eq: (column: string, value: unknown) => QueryStep;
  single: () => Promise<{ data: { id: string; session_token?: string } | null; error: unknown }>;
  order: (column: string, options?: Record<string, unknown>) => Promise<{ data: SavedAnswer[] | null; error: unknown }>;
  update: (values: Record<string, unknown>) => QueryStep;
  upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{ data?: unknown; error: unknown }>;
  insert: (values: Record<string, unknown>) => Promise<{ data?: unknown; error: unknown }>;
};

export class IncompleteAssessmentError extends Error {}

export async function completeQuizWithClient(client: SupabaseLike, sessionToken: string) {
  const sessions = client.from("quiz_sessions") as QueryStep;
  const answersTable = client.from("quiz_answers") as QueryStep;
  const reports = client.from("reports") as QueryStep;

  const sessionQuery = sessions.select("id, session_token").eq("session_token", sessionToken).single() as Promise<{
    data: { id: string; session_token: string } | null;
    error: unknown;
  }>;
  const { data: session, error: sessionError } = await sessionQuery;
  if (sessionError || !session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  const answerQuery = answersTable.select("question_key, answer_key, question_text, answer_text, answer_score").eq("quiz_session_id", session.id).order("question_key") as Promise<{
    data: SavedAnswer[] | null;
    error: unknown;
  }>;
  const { data: answers, error: answersError } = await answerQuery;
  if (answersError || !answers) {
    throw new Error("ANSWERS_NOT_FOUND");
  }

  const uniqueKeys = new Set(answers.map((answer) => answer.question_key));
  if (uniqueKeys.size !== assessmentQuestions.length) {
    throw new IncompleteAssessmentError("INCOMPLETE_ASSESSMENT");
  }

  const score = calculateScore(answers);
  const resultType = getResultType(score);
  const report = getReportTemplate(resultType);

  await (sessions.update({ score, result_type: resultType, status: "completed" }).eq("id", session.id) as unknown as Promise<unknown>);

  const { error: reportError } = await reports.upsert(
    {
      quiz_session_id: session.id,
      result_type: resultType,
      score,
      title: report.title,
      free_summary: report.freeSummary,
      immediate_action: report.immediateAction,
      sample_message: report.sampleMessage,
      full_summary: report.fullSummary,
      communication_pattern: report.communicationPattern,
      possible_reasons: report.possibleReasons,
      action_plan: report.actionPlan,
      mistakes_to_avoid: report.mistakesToAvoid,
      suggested_conversation: report.suggestedConversation,
      relationship_insight: report.relationshipInsight,
      suggested_messages: report.suggestedMessages,
      is_unlocked: false,
    },
    { onConflict: "quiz_session_id" },
  );
  if (reportError) {
    console.error("reports upsert failed", reportError);
    const { error: minimalReportError } = await reports.upsert(
      {
        quiz_session_id: session.id,
        is_unlocked: false,
      },
      { onConflict: "quiz_session_id" },
    );
    if (minimalReportError) {
      await reports.insert({
        quiz_session_id: session.id,
        is_unlocked: false,
      });
    }
  }

  return { sessionToken, score, resultType };
}
