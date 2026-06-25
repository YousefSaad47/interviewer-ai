import { z } from "zod";

import {
  Difficulty,
  InterviewCategory,
  InterviewStatus,
} from "@/generated/enums";

export const ADMIN_INTERVIEWS_DEFAULT_LIMIT = 10;
export const ADMIN_INTERVIEWS_MAX_LIMIT = 50;

const interviewCategorySchema = z.enum(InterviewCategory);
const difficultySchema = z.enum(Difficulty);
const interviewStatusSchema = z.enum(InterviewStatus);

const dateTimeQuerySchema = z.iso.datetime();

export const adminInterviewsQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100)
      .transform((value) => (value.length > 0 ? value : undefined))
      .optional(),
    userId: z.uuid().optional(),
    status: interviewStatusSchema.optional(),
    category: interviewCategorySchema.optional(),
    difficulty: difficultySchema.optional(),
    from: dateTimeQuerySchema.optional(),
    to: dateTimeQuerySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(ADMIN_INTERVIEWS_MAX_LIMIT)
      .default(ADMIN_INTERVIEWS_DEFAULT_LIMIT),
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

export const adminInterviewParamsSchema = z.object({
  id: z.uuid(),
});

const adminInterviewCandidateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
});

const nullableScoreSchema = z.number().nullable();

export const adminInterviewListItemSchema = z.object({
  id: z.uuid(),
  candidate: adminInterviewCandidateSchema,
  category: interviewCategorySchema,
  difficulty: difficultySchema,
  status: interviewStatusSchema,
  questionCount: z.number().int(),
  answeredQuestionCount: z.number().int(),
  currentQuestion: z.number().int(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().nullable(),
  durationSeconds: z.number().int().nullable(),
  overallScore: nullableScoreSchema,
});

export const adminInterviewsListResponseSchema = z.object({
  data: z.array(adminInterviewListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

const adminAnswerFeedbackDetailsSchema = z.object({
  id: z.uuid(),
  overallScore: nullableScoreSchema,
  idealAnswer: z.string().nullable(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  fillerWordCount: z.number().int().nullable(),
  fluencyScore: nullableScoreSchema,
  clarityScore: nullableScoreSchema,
  confidenceScore: nullableScoreSchema,
  relevanceScore: nullableScoreSchema,
  technicalAccuracy: nullableScoreSchema,
  detailLevel: z.string().nullable(),
  sentimentScore: nullableScoreSchema,
});

const adminInterviewAnswerDetailsSchema = z.object({
  id: z.uuid(),
  transcript: z.string().nullable(),
  durationMs: z.number().int().nullable(),
  createdAt: z.iso.datetime(),
  feedback: z.array(adminAnswerFeedbackDetailsSchema),
});

const adminInterviewQuestionDetailsSchema = z.object({
  id: z.uuid(),
  sortOrder: z.number().int(),
  question: z.object({
    id: z.uuid(),
    text: z.string(),
    category: interviewCategorySchema,
    difficulty: difficultySchema,
  }),
  followUpText: z.string().nullable(),
  answers: z.array(adminInterviewAnswerDetailsSchema),
});

export const adminInterviewDetailsResponseSchema = adminInterviewListItemSchema
  .omit({ answeredQuestionCount: true })
  .extend({
    scores: z.object({
      communication: nullableScoreSchema,
      technical: nullableScoreSchema,
      confidence: nullableScoreSchema,
    }),
    questions: z.array(adminInterviewQuestionDetailsSchema),
  });

export type AdminInterviewsQuery = z.infer<typeof adminInterviewsQuerySchema>;
export type AdminInterviewListItem = z.infer<
  typeof adminInterviewListItemSchema
>;
export type AdminInterviewDetails = z.infer<
  typeof adminInterviewDetailsResponseSchema
>;
