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

export const interviewFinalizeParamsSchema = z.object({
  id: z.uuid(),
});

export type InterviewStartInput = z.infer<typeof interviewStartSchema>;
export type InterviewFinalizeInput = z.infer<typeof interviewFinalizeSchema>;
