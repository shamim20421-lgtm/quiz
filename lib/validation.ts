import { z } from "zod";

export const problemTypeSchema = z.enum([
  "not_texting",
  "late_reply",
  "losing_interest",
  "avoiding_me",
  "after_fight",
  "message_help",
]);

export const toneSchema = z.enum(["soft", "mature", "romantic", "confident"]);

export const startQuizSchema = z.object({
  problemType: problemTypeSchema,
});

export const answerSchema = z.object({
  sessionToken: z.string().min(12).max(200),
  questionKey: z.string().regex(/^q([1-9]|10)$/),
  answerKey: z.string().min(1).max(80),
});

export const completeQuizSchema = z.object({
  sessionToken: z.string().min(12).max(200),
});

export const demoPaymentSchema = z.object({
  sessionToken: z.string().min(12).max(200),
  name: z.string().trim().min(1).max(120),
  mobileNumber: z.string().trim().min(6).max(30),
  transactionId: z.string().trim().min(3).max(80).optional(),
});

export const messageGenerateSchema = z.object({
  sessionToken: z.string().min(12).max(200).optional(),
  receivedText: z.string().trim().min(1).max(1000),
  intention: z.string().trim().min(1).max(1000),
  tone: toneSchema,
});
