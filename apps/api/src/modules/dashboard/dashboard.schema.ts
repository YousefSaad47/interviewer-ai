import { z } from "zod";

export const dashboardStatsSchema = z.object({
  interviewsCompleted: z.number().int(),
  averageScore: z.number(),
  practiceTimeMinutes: z.number().int(),
  problemsSolved: z.number().int(),
});

export const recentActivitySchema = z.object({
  interviews: z.array(
    z.object({
      id: z.uuid(),
      category: z.string(),
      difficulty: z.string(),
      status: z.string(),
      score: z.number().nullable(),
      completedAt: z.iso.datetime().nullable(),
      startedAt: z.iso.datetime(),
    }),
  ),
  submissions: z.array(
    z.object({
      id: z.uuid(),
      problemTitle: z.string(),
      language: z.string(),
      status: z.string(),
      executionTimeMs: z.number().int().nullable(),
      createdAt: z.iso.datetime(),
    }),
  ),
});

export const skillsSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      avgScore: z.number(),
      count: z.number().int(),
    }),
  ),
});

export const goalsSchema = z.object({
  interviewGoal: z.number().int(),
  interviewsDone: z.number().int(),
  problemGoal: z.number().int(),
  problemsDone: z.number().int(),
});
