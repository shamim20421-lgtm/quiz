import { findAnswer } from "@/lib/assessment/questions";

export function buildAnswerRecord(quizSessionId: string, questionKey: string, answerKey: string) {
  const match = findAnswer(questionKey, answerKey);
  if (!match) return null;

  return {
    quiz_session_id: quizSessionId,
    question_key: match.question.key,
    answer_key: match.answer.key,
    question_text: match.question.text,
    answer_text: match.answer.text,
    answer_score: match.answer.score,
  };
}
