import { describe, expect, it } from "vitest";
import { buildAnswerRecord } from "@/lib/assessment/answer-record";

describe("server-derived answer records", () => {
  it("derives score and text from the server assessment definition", () => {
    const record = buildAnswerRecord("session-id", "q1", "much_less");

    expect(record).toMatchObject({
      quiz_session_id: "session-id",
      question_key: "q1",
      answer_key: "much_less",
      question_text: "আগের তুলনায় এখন যোগাযোগ কতটা কমেছে?",
      answer_text: "অনেক কমেছে",
      answer_score: 3,
    });
  });

  it("rejects unknown browser-submitted answer keys", () => {
    expect(buildAnswerRecord("session-id", "q1", "browser_score_30")).toBeNull();
  });
});
