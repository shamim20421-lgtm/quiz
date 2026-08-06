import { describe, expect, it } from "vitest";
import { IncompleteAssessmentError, completeQuizWithClient } from "@/lib/assessment/complete";

function createClient(answerCount: number) {
  const answers = Array.from({ length: answerCount }, (_, index) => ({
    question_key: `q${index + 1}`,
    answer_key: "same",
    question_text: "প্রশ্ন",
    answer_text: "উত্তর",
    answer_score: 1,
  }));

  return {
    from(table: string) {
      if (table === "quiz_sessions") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: "session-id", session_token: "token" }, error: null }),
            }),
          }),
          update: () => ({ eq: async () => ({ data: null, error: null }) }),
        };
      }

      if (table === "quiz_answers") {
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({ data: answers, error: null }),
            }),
          }),
        };
      }

      return {
        upsert: async () => ({ data: null, error: null }),
      };
    },
  };
}

describe("quiz completion", () => {
  it("rejects completion when fewer than ten unique answers exist", async () => {
    await expect(completeQuizWithClient(createClient(9), "token")).rejects.toBeInstanceOf(IncompleteAssessmentError);
  });

  it("completes when ten answers exist", async () => {
    await expect(completeQuizWithClient(createClient(10), "token")).resolves.toMatchObject({
      score: 10,
      resultType: "temporary_distance",
    });
  });
});
