export type ProblemType =
  | "not_texting"
  | "late_reply"
  | "losing_interest"
  | "avoiding_me"
  | "after_fight"
  | "message_help";

export type ResultType =
  | "stable"
  | "temporary_distance"
  | "communication_imbalance"
  | "emotional_distance";

export type Tone = "soft" | "mature" | "romantic" | "confident";

export type ReportTemplate = {
  title: string;
  freeSummary: string[];
  immediateAction: string;
  avoidToday: string;
  sampleMessage: string;
  fullSummary: string;
  communicationPattern: string;
  possibleReasons: [string, string, string];
  actionPlan: [string, string, string];
  mistakesToAvoid: [string, string, string, string, string];
  suggestedConversation: string;
  relationshipInsight: string;
  suggestedMessages: [string, string, string];
};

export type SavedAnswer = {
  question_key: string;
  answer_key: string;
  question_text: string;
  answer_text: string;
  answer_score: number;
};
