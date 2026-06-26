import { z } from "zod";

import { ProblemDifficulty, SubmissionStatus } from "@/generated/enums";

export const ADMIN_CODING_DEFAULT_LIMIT = 10;
export const ADMIN_CODING_MAX_LIMIT = 50;

const submissionStatusSchema = z.enum(SubmissionStatus);
const problemDifficultySchema = z.enum(ProblemDifficulty);
const dateTimeQuerySchema = z.iso.datetime();
const nullableScoreSchema = z.number().nullable();

export const adminCodingSubmissionsQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100)
      .transform((value) => (value.length > 0 ? value : undefined))
      .optional(),
    userId: z.uuid().optional(),
    problemId: z.uuid().optional(),
    status: submissionStatusSchema.optional(),
    language: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .transform((value) => value.toLowerCase())
      .optional(),
    difficulty: problemDifficultySchema.optional(),
    from: dateTimeQuerySchema.optional(),
    to: dateTimeQuerySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(ADMIN_CODING_MAX_LIMIT)
      .default(ADMIN_CODING_DEFAULT_LIMIT),
  })
  .superRefine((query, context) => {
    if (
      query.from &&
      query.to &&
      Date.parse(query.from) > Date.parse(query.to)
    ) {
      context.addIssue({
        code: "custom",
        path: ["from"],
        message: "from must be earlier than or equal to to",
      });
    }
  });

export const adminCodingSubmissionParamsSchema = z.object({
  id: z.uuid(),
});

const adminCodingUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
});

const adminCodingProblemListSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  difficulty: problemDifficultySchema,
});

const adminCodingProblemDetailsSchema = adminCodingProblemListSchema.extend({
  description: z.string(),
  constraints: z.string().nullable(),
});

export const adminCodingSubmissionListItemSchema = z.object({
  id: z.uuid(),
  user: adminCodingUserSchema,
  problem: adminCodingProblemListSchema,
  language: z.string(),
  status: submissionStatusSchema,
  score: nullableScoreSchema,
  executionTimeMs: z.number().int().nullable(),
  memoryUsedKb: z.number().int().nullable(),
  createdAt: z.iso.datetime(),
});

export const adminCodingSubmissionsListResponseSchema = z.object({
  data: z.array(adminCodingSubmissionListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

const adminCodingSubmissionResultSchema = z.object({
  id: z.uuid(),
  passed: z.boolean(),
  output: z.string().nullable(),
  error: z.string().nullable(),
  testCase: z.object({
    id: z.uuid(),
    isHidden: z.boolean(),
    sortOrder: z.number().int(),
    input: z.string().optional(),
    output: z.string().optional(),
  }),
});

export const adminCodingSubmissionDetailsResponseSchema =
  adminCodingSubmissionListItemSchema.omit({ problem: true }).extend({
    problem: adminCodingProblemDetailsSchema,
    code: z.string(),
    scores: z.object({
      logic: nullableScoreSchema,
      naming: nullableScoreSchema,
      efficiency: nullableScoreSchema,
      bestPractices: nullableScoreSchema,
    }),
    aiFeedback: z.string().nullable(),
    results: z.array(adminCodingSubmissionResultSchema),
  });

export type AdminCodingSubmissionsQuery = z.infer<
  typeof adminCodingSubmissionsQuerySchema
>;
export type AdminCodingSubmissionListItem = z.infer<
  typeof adminCodingSubmissionListItemSchema
>;
export type AdminCodingSubmissionDetails = z.infer<
  typeof adminCodingSubmissionDetailsResponseSchema
>;
