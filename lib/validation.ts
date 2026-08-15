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

function normalizeBangladeshMobile(value: string) {
  const normalized = value.trim().replace(/[\s-]/g, "");
  if (/^01[3-9]\d{8}$/.test(normalized)) return normalized;
  if (/^\+8801[3-9]\d{8}$/.test(normalized)) return `0${normalized.slice(4)}`;
  if (/^8801[3-9]\d{8}$/.test(normalized)) return `0${normalized.slice(3)}`;
  return normalized;
}

export const earlyAccessSchema = z.object({
  sessionToken: z.string().min(12).max(200),
  name: z.string().trim().min(2).max(100),
  mobileNumber: z
    .string()
    .trim()
    .transform(normalizeBangladeshMobile)
    .refine((value) => /^01[3-9]\d{8}$/.test(value), { message: "INVALID_MOBILE" }),
  feedback: z.string().trim().max(1000).optional(),
});

export const messageGenerateSchema = z.object({
  sessionToken: z.string().min(12).max(200).optional(),
  receivedText: z.string().trim().min(1).max(1000),
  intention: z.string().trim().min(1).max(1000),
  tone: toneSchema,
});
