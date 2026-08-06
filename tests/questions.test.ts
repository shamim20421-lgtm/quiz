import { describe, expect, it } from "vitest";
import { assessmentQuestions } from "@/lib/assessment/questions";
import { buildAnswerRecord } from "@/lib/assessment/answer-record";

const expectedQuestions = [
  {
    text: "গত ৭ দিনে সে নিজে থেকে কতদিন বার্তা পাঠিয়েছে?",
    answers: [
      ["প্রায় প্রতিদিন", 0],
      ["৩–৫ দিন", 1],
      ["১–২ দিন", 2],
      ["একবারও না", 3],
    ],
  },
  {
    text: "শেষ কয়েকটি বার্তার উত্তর সাধারণত কত সময় পরে এসেছে?",
    answers: [
      ["কয়েক মিনিটের মধ্যে", 0],
      ["এক ঘণ্টার মধ্যে", 1],
      ["কয়েক ঘণ্টা পরে", 2],
      ["একদিন বা তারও পরে", 3],
    ],
  },
  {
    text: "শেষবার কথা শুরু করেছিল কে?",
    answers: [
      ["সে", 0],
      ["দুজনই প্রায় সমানভাবে", 1],
      ["আমি", 2],
      ["প্রায় সবসময় আমিই শুরু করি", 3],
    ],
  },
  {
    text: "গত ৭ দিনে সে কি নিজে থেকে আপনার খবর জানতে চেয়েছে?",
    answers: [
      ["কয়েকবার", 0],
      ["একবার", 1],
      ["মনে নেই", 2],
      ["না", 3],
    ],
  },
  {
    text: "আপনি আজ বার্তা না পাঠালে কী হতে পারে বলে মনে হয়?",
    answers: [
      ["সে নিজে থেকেই লিখবে", 0],
      ["হয়তো পরে লিখবে", 1],
      ["নিশ্চিত নই", 2],
      ["সম্ভবত লিখবে না", 3],
    ],
  },
  {
    text: "কথোপকথনের সময় তার উত্তর কেমন হয়?",
    answers: [
      ["আগ্রহ নিয়ে কথা বলে এবং প্রশ্ন করে", 0],
      ["স্বাভাবিকভাবে উত্তর দেয়", 1],
      ["খুব ছোট উত্তর দেয়", 2],
      ["অনেক সময় উত্তরই দেয় না", 3],
    ],
  },
  {
    text: "দেখা করা বা ফোনে কথা বলার বিষয়ে তার আচরণ কেমন?",
    answers: [
      ["নিজে থেকেই পরিকল্পনা করে", 0],
      ["রাজি হয়, কিন্তু উদ্যোগ কম", 1],
      ["প্রায়ই পিছিয়ে দেয়", 2],
      ["এড়িয়ে যায় বা কারণ দেখায়", 3],
    ],
  },
  {
    text: "সম্পর্কের পরিবর্তন নিয়ে কথা তুললে সে কী করে?",
    answers: [
      ["শান্তভাবে কথা বলে", 0],
      ["সংক্ষেপে উত্তর দেয়", 1],
      ["বিষয় পরিবর্তন করে", 2],
      ["বিরক্ত হয় বা এড়িয়ে যায়", 3],
    ],
  },
  {
    text: "সম্প্রতি কোনো ঝগড়া, ভুল বোঝাবুঝি বা বড় পরিবর্তন হয়েছে?",
    answers: [
      ["কিছু হয়নি", 0],
      ["ছোট ভুল বোঝাবুঝি হয়েছে", 1],
      ["বড় ধরনের চাপ বা পরিবর্তন হয়েছে", 2],
      ["বড় ঝগড়া হয়েছে", 3],
    ],
  },
  {
    text: "এই পরিবর্তন কতদিন ধরে লক্ষ্য করছেন?",
    answers: [
      ["কয়েক দিন", 0],
      ["১–২ সপ্তাহ", 1],
      ["প্রায় এক মাস", 2],
      ["এক মাসের বেশি", 3],
    ],
  },
];

describe("assessment questions", () => {
  it("uses the complete situation-based ten-question set", () => {
    expect(assessmentQuestions).toHaveLength(10);

    expectedQuestions.forEach((expected, index) => {
      const question = assessmentQuestions[index];
      expect(question.key).toBe(`q${index + 1}`);
      expect(question.text).toBe(expected.text);
      expect(question.answers.map((answer) => [answer.text, answer.score])).toEqual(expected.answers);
    });
  });

  it("derives answer scores from the server-side definition", () => {
    assessmentQuestions.forEach((question) => {
      question.answers.forEach((answer) => {
        expect(buildAnswerRecord("session-id", question.key, answer.key)).toMatchObject({
          question_text: question.text,
          answer_text: answer.text,
          answer_score: answer.score,
        });
      });
    });
  });
});
