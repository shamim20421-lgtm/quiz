export type AnswerDefinition = {
  key: string;
  text: string;
  score: number;
};

export type QuestionDefinition = {
  key: `q${number}`;
  text: string;
  answers: AnswerDefinition[];
};

export const assessmentQuestions: QuestionDefinition[] = [
  {
    key: "q1",
    text: "আগের তুলনায় এখন যোগাযোগ কতটা কমেছে?",
    answers: [
      { key: "much_less", text: "অনেক কমেছে", score: 3 },
      { key: "somewhat_less", text: "কিছুটা কমেছে", score: 2 },
      { key: "same", text: "প্রায় একই আছে", score: 1 },
      { key: "increased", text: "যোগাযোগ বেড়েছে", score: 0 },
    ],
  },
  {
    key: "q2",
    text: "আপনি বার্তা না পাঠালে সে নিজে থেকে যোগাযোগ করে?",
    answers: [
      { key: "never", text: "কখনোই না", score: 3 },
      { key: "rarely", text: "খুব কম", score: 2 },
      { key: "sometimes", text: "মাঝে মাঝে", score: 1 },
      { key: "almost_always", text: "প্রায় সবসময়", score: 0 },
    ],
  },
  {
    key: "q3",
    text: "তার উত্তর এখন কেমন?",
    answers: [
      { key: "often_no_reply", text: "অনেক সময় উত্তরই দেয় না", score: 3 },
      { key: "short_replies", text: "খুব ছোট উত্তর দেয়", score: 2 },
      { key: "normal", text: "স্বাভাবিক উত্তর দেয়", score: 1 },
      { key: "detailed", text: "আগ্রহ নিয়ে বিস্তারিত উত্তর দেয়", score: 0 },
    ],
  },
  {
    key: "q4",
    text: "দেখা করা বা ফোনে কথা বলার বিষয়ে তার আচরণ কেমন?",
    answers: [
      { key: "always_excuses", text: "সবসময় কোনো কারণ দেখায়", score: 3 },
      { key: "often_avoids", text: "প্রায়ই এড়িয়ে যায়", score: 2 },
      { key: "agrees_low_initiative", text: "রাজি হয়, কিন্তু উদ্যোগ কম", score: 1 },
      { key: "plans_first", text: "নিজে থেকে পরিকল্পনা করে", score: 0 },
    ],
  },
  {
    key: "q5",
    text: "সম্প্রতি কোনো ঝগড়া বা ভুল বোঝাবুঝি হয়েছিল?",
    answers: [
      { key: "big_fight", text: "বড় ধরনের ঝগড়া", score: 3 },
      { key: "small_misunderstanding", text: "ছোট ভুল বোঝাবুঝি", score: 2 },
      { key: "not_sure", text: "নিশ্চিত নই", score: 1 },
      { key: "nothing", text: "কিছু হয়নি", score: 0 },
    ],
  },
  {
    key: "q6",
    text: "তার জীবনে এখন কোনো বড় চাপ আছে বলে জানেন?",
    answers: [
      { key: "unknown", text: "কিছু জানা নেই", score: 2 },
      { key: "personal_stress", text: "ব্যক্তিগত বা মানসিক চাপ", score: 1 },
      { key: "family_money_stress", text: "পরিবার বা আর্থিক চাপ", score: 1 },
      { key: "work_study_stress", text: "কাজ বা পড়াশোনার চাপ", score: 1 },
    ],
  },
  {
    key: "q7",
    text: "সম্পর্ক নিয়ে কথা বললে সে কী করে?",
    answers: [
      { key: "fully_avoids", text: "সম্পূর্ণ এড়িয়ে যায়", score: 3 },
      { key: "gets_annoyed", text: "বিরক্ত হয়", score: 2 },
      { key: "changes_topic", text: "বিষয় পরিবর্তন করে", score: 1 },
      { key: "open_talk", text: "খোলামেলা কথা বলে", score: 0 },
    ],
  },
  {
    key: "q8",
    text: "উত্তর পাওয়ার জন্য আপনি কি বারবার বার্তা পাঠান?",
    answers: [
      { key: "often", text: "প্রায়ই", score: 3 },
      { key: "sometimes", text: "মাঝে মাঝে", score: 2 },
      { key: "rarely", text: "খুব কম", score: 1 },
      { key: "never", text: "কখনো না", score: 0 },
    ],
  },
  {
    key: "q9",
    text: "ভবিষ্যৎ নিয়ে তার আগ্রহ কি কমেছে?",
    answers: [
      { key: "much_less", text: "অনেক কমেছে", score: 3 },
      { key: "somewhat_less", text: "কিছুটা কমেছে", score: 2 },
      { key: "same", text: "একই আছে", score: 1 },
      { key: "interested", text: "ভবিষ্যৎ নিয়ে আগ্রহী", score: 0 },
    ],
  },
  {
    key: "q10",
    text: "এই পরিবর্তন কতদিন ধরে চলছে?",
    answers: [
      { key: "more_than_month", text: "এক মাসের বেশি", score: 3 },
      { key: "about_month", text: "প্রায় এক মাস", score: 2 },
      { key: "one_two_weeks", text: "এক থেকে দুই সপ্তাহ", score: 1 },
      { key: "few_days", text: "কয়েক দিন", score: 0 },
    ],
  },
];

export function findQuestion(questionKey: string) {
  return assessmentQuestions.find((question) => question.key === questionKey);
}

export function findAnswer(questionKey: string, answerKey: string) {
  const question = findQuestion(questionKey);
  const answer = question?.answers.find((item) => item.key === answerKey);

  if (!question || !answer) {
    return null;
  }

  return { question, answer };
}
