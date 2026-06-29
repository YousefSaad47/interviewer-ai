import { z } from "zod";

export const interviewStartSchema = z.object({
  category: z.enum([
    "DATA_STRUCTURES",
    "ALGORITHMS",
    "SYSTEM_DESIGN",
    "BEHAVIORAL",
    "HR",
    "FRONTEND",
    "BACKEND",
    "FULLSTACK",
    "DATABASE",
    "DEVOPS",
    "MACHINE_LEARNING",
  ]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("EASY"),
  questionCount: z.number().int().min(1).max(10).default(5),
  targetRole: z.string().optional(),
  experienceLevel: z.string().optional(),
  interviewFocus: z.string().optional(),
  additionalContext: z.string().optional(),
});

export const interviewFinalizeSchema = z.object({
  chatId: z.string().min(1),
  chatGroupId: z.string().min(1),
});

export const interviewLinkChatSchema = interviewFinalizeSchema;

export const interviewFinalizeParamsSchema = z.object({
  id: z.uuid(),
});

export const interviewAnswerFeedbackSchema = z.object({
  id: z.uuid(),
  overallScore: z.number().nullable(),
  fluencyScore: z.number().nullable(),
  clarityScore: z.number().nullable(),
  confidenceScore: z.number().nullable(),
  fillerWordCount: z.number().int().nullable(),
  sentimentScore: z.number().nullable(),
  relevanceScore: z.number().nullable(),
  technicalAccuracy: z.number().nullable(),
  detailLevel: z.string().nullable(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  idealAnswer: z.string().nullable(),
});

export const interviewAnswerSchema = z.object({
  id: z.uuid(),
  transcript: z.string().nullable(),
  durationMs: z.number().int().nullable(),
  createdAt: z.string(),
  feedback: z.array(interviewAnswerFeedbackSchema),
});

export const interviewQuestionDetailSchema = z.object({
  id: z.uuid(),
  sortOrder: z.number().int(),
  text: z.string(),
  category: z.string(),
  difficulty: z.string(),
  answers: z.array(interviewAnswerSchema),
});

export const interviewDetailSchema = z.object({
  id: z.uuid(),
  category: z.string(),
  difficulty: z.string(),
  status: z.string(),
  questionCount: z.number().int(),
  currentQuestion: z.number().int(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  durationSeconds: z.number().int().nullable(),
  overallScore: z.number().nullable(),
  questions: z.array(interviewQuestionDetailSchema),
});

export type InterviewStartInput = z.infer<typeof interviewStartSchema>;
export type InterviewFinalizeInput = z.infer<typeof interviewFinalizeSchema>;
