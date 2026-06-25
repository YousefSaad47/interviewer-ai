import { z } from "zod";

export const problemQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  search: z.string().optional(),
});

export const problemSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  description: z.string(),
  constraints: z.string().nullable(),
  examples: z.unknown(),
  testCaseCount: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const problemListResponseSchema = z.object({
  data: z.array(problemSchema),
  nextCursor: z.string().nullable(),
});

export const problemDetailResponseSchema = problemSchema;

export const problemParamsSchema = z.object({
  slug: z.string().min(1),
});

export type ProblemQuery = z.infer<typeof problemQuerySchema>;
