import type { ResultType, SavedAnswer } from "@/lib/types";

export function getResultType(score: number): ResultType {
  if (score <= 7) return "stable";
  if (score <= 15) return "temporary_distance";
  if (score <= 23) return "communication_imbalance";
  return "emotional_distance";
}

export function calculateScore(answers: Pick<SavedAnswer, "answer_score">[]) {
  return answers.reduce((total, answer) => total + Number(answer.answer_score), 0);
}
