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
    text: "গত ৭ দিনে সে নিজে থেকে কতদিন বার্তা পাঠিয়েছে?",
    answers: [
      { key: "almost_daily", text: "প্রায় প্রতিদিন", score: 0 },
      { key: "three_to_five_days", text: "৩–৫ দিন", score: 1 },
      { key: "one_to_two_days", text: "১–২ দিন", score: 2 },
      { key: "not_once", text: "একবারও না", score: 3 },
    ],
  },
  {
    key: "q2",
    text: "শেষ কয়েকটি বার্তার উত্তর সাধারণত কত সময় পরে এসেছে?",
    answers: [
      { key: "within_minutes", text: "কয়েক মিনিটের মধ্যে", score: 0 },
      { key: "within_hour", text: "এক ঘণ্টার মধ্যে", score: 1 },
      { key: "after_hours", text: "কয়েক ঘণ্টা পরে", score: 2 },
      { key: "after_day_or_more", text: "একদিন বা তারও পরে", score: 3 },
    ],
  },
  {
    key: "q3",
    text: "শেষবার কথা শুরু করেছিল কে?",
    answers: [
      { key: "they_started", text: "সে", score: 0 },
      { key: "both_equal", text: "দুজনই প্রায় সমানভাবে", score: 1 },
      { key: "i_started", text: "আমি", score: 2 },
      { key: "almost_always_me", text: "প্রায় সবসময় আমিই শুরু করি", score: 3 },
    ],
  },
  {
    key: "q4",
    text: "গত ৭ দিনে সে কি নিজে থেকে আপনার খবর জানতে চেয়েছে?",
    answers: [
      { key: "several_times", text: "কয়েকবার", score: 0 },
      { key: "once", text: "একবার", score: 1 },
      { key: "do_not_remember", text: "মনে নেই", score: 2 },
      { key: "no", text: "না", score: 3 },
    ],
  },
  {
    key: "q5",
    text: "আপনি আজ বার্তা না পাঠালে কী হতে পারে বলে মনে হয়?",
    answers: [
      { key: "they_will_write", text: "সে নিজে থেকেই লিখবে", score: 0 },
      { key: "maybe_later", text: "হয়তো পরে লিখবে", score: 1 },
      { key: "not_sure", text: "নিশ্চিত নই", score: 2 },
      { key: "probably_not", text: "সম্ভবত লিখবে না", score: 3 },
    ],
  },
  {
    key: "q6",
    text: "কথোপকথনের সময় তার উত্তর কেমন হয়?",
    answers: [
      { key: "engaged_and_asks", text: "আগ্রহ নিয়ে কথা বলে এবং প্রশ্ন করে", score: 0 },
      { key: "normal_reply", text: "স্বাভাবিকভাবে উত্তর দেয়", score: 1 },
      { key: "very_short", text: "খুব ছোট উত্তর দেয়", score: 2 },
      { key: "often_no_reply", text: "অনেক সময় উত্তরই দেয় না", score: 3 },
    ],
  },
  {
    key: "q7",
    text: "দেখা করা বা ফোনে কথা বলার বিষয়ে তার আচরণ কেমন?",
    answers: [
      { key: "plans_first", text: "নিজে থেকেই পরিকল্পনা করে", score: 0 },
      { key: "agrees_low_initiative", text: "রাজি হয়, কিন্তু উদ্যোগ কম", score: 1 },
      { key: "often_postpones", text: "প্রায়ই পিছিয়ে দেয়", score: 2 },
      { key: "avoids_or_excuses", text: "এড়িয়ে যায় বা কারণ দেখায়", score: 3 },
    ],
  },
  {
    key: "q8",
    text: "সম্পর্কের পরিবর্তন নিয়ে কথা তুললে সে কী করে?",
    answers: [
      { key: "calm_talk", text: "শান্তভাবে কথা বলে", score: 0 },
      { key: "brief_reply", text: "সংক্ষেপে উত্তর দেয়", score: 1 },
      { key: "changes_topic", text: "বিষয় পরিবর্তন করে", score: 2 },
      { key: "annoyed_or_avoids", text: "বিরক্ত হয় বা এড়িয়ে যায়", score: 3 },
    ],
  },
  {
    key: "q9",
    text: "সম্প্রতি কোনো ঝগড়া, ভুল বোঝাবুঝি বা বড় পরিবর্তন হয়েছে?",
    answers: [
      { key: "nothing", text: "কিছু হয়নি", score: 0 },
      { key: "small_misunderstanding", text: "ছোট ভুল বোঝাবুঝি হয়েছে", score: 1 },
      { key: "big_stress_or_change", text: "বড় ধরনের চাপ বা পরিবর্তন হয়েছে", score: 2 },
      { key: "big_fight", text: "বড় ঝগড়া হয়েছে", score: 3 },
    ],
  },
  {
    key: "q10",
    text: "এই পরিবর্তন কতদিন ধরে লক্ষ্য করছেন?",
    answers: [
      { key: "few_days", text: "কয়েক দিন", score: 0 },
      { key: "one_two_weeks", text: "১–২ সপ্তাহ", score: 1 },
      { key: "about_month", text: "প্রায় এক মাস", score: 2 },
      { key: "more_than_month", text: "এক মাসের বেশি", score: 3 },
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
