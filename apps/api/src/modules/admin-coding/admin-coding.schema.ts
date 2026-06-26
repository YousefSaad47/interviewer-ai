import { z } from "zod";

import { ProblemDifficulty, SubmissionStatus } from "@/generated/enums";

export const ADMIN_CODING_DEFAULT_LIMIT = 10;
export const ADMIN_CODING_MAX_LIMIT = 50;

const submissionStatusSchema = z.enum(SubmissionStatus);
const problemDifficultySchema = z.enum(ProblemDifficulty);
const dateTimeQuerySchema = z.iso.datetime();
const nullableScoreSchema = z.number().nullable();
const trimmedStringSchema = z.string().trim();
const slugSchema = trimmedStringSchema
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Slug must use lowercase letters, numbers, and single hyphens only",
  });

const createProblemExampleSchema = z.object({
  input: trimmedStringSchema.min(1).max(4000),
  output: trimmedStringSchema.min(1).max(4000),
  explanation: trimmedStringSchema.max(4000).optional(),
});

const createProblemTestCaseSchema = z.object({
  input: trimmedStringSchema.min(1).max(8000),
  output: trimmedStringSchema.min(1).max(8000),
  isHidden: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});

const createProblemTagsSchema = z.array(trimmedStringSchema.min(1).max(60));

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

export const adminCodingCreateProblemBodySchema = z
  .object({
    title: trimmedStringSchema.min(3).max(160),
    slug: slugSchema.optional(),
    difficulty: problemDifficultySchema,
    description: trimmedStringSchema.min(20).max(50_000),
    constraints: trimmedStringSchema.max(10_000).optional(),
    examples: z.array(createProblemExampleSchema).min(1).max(10),
    starterCode: z
      .record(
        trimmedStringSchema.min(1).max(40),
        trimmedStringSchema.max(30_000),
      )
      .optional(),
    testCases: z.array(createProblemTestCaseSchema).min(1).max(100),
    topics: createProblemTagsSchema.max(20).optional(),
    companies: createProblemTagsSchema.max(20).optional(),
    hint: trimmedStringSchema.max(5000).optional(),
    isPremium: z.boolean().optional(),
  })
  .superRefine((body, context) => {
    if (!body.testCases.some((testCase) => !testCase.isHidden)) {
      context.addIssue({
        code: "custom",
        path: ["testCases"],
        message: "At least one visible test case is required",
      });
    }
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

const adminCodingProblemExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

const adminCodingProblemTestCaseSchema = z.object({
  id: z.uuid(),
  input: z.string(),
  output: z.string(),
  isHidden: z.boolean(),
  sortOrder: z.number().int(),
});

export const adminCodingCreateProblemResponseSchema =
  adminCodingProblemDetailsSchema.extend({
    examples: z.array(adminCodingProblemExampleSchema),
    starterCode: z.record(z.string(), z.string()).nullable(),
    topics: z.array(z.string()),
    companies: z.array(z.string()),
    hint: z.string().nullable(),
    isPremium: z.boolean(),
    testCases: z.array(adminCodingProblemTestCaseSchema),
    createdAt: z.iso.datetime(),
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
export type AdminCodingCreateProblemBody = z.infer<
  typeof adminCodingCreateProblemBodySchema
>;
export type AdminCodingCreateProblemResponse = z.infer<
  typeof adminCodingCreateProblemResponseSchema
>;
