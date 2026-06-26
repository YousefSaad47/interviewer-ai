import { z } from "zod";

import { ResumeStatus } from "@/generated/enums";

export const ADMIN_RESUMES_DEFAULT_LIMIT = 10;
export const ADMIN_RESUMES_MAX_LIMIT = 50;

const resumeStatusSchema = z.enum(ResumeStatus);
const dateTimeQuerySchema = z.iso.datetime();
const nullableScoreSchema = z.number().nullable();

export const adminResumesQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100)
      .transform((value) => (value.length > 0 ? value : undefined))
      .optional(),
    userId: z.uuid().optional(),
    status: resumeStatusSchema.optional(),
    from: dateTimeQuerySchema.optional(),
    to: dateTimeQuerySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(ADMIN_RESUMES_MAX_LIMIT)
      .default(ADMIN_RESUMES_DEFAULT_LIMIT),
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

export const adminResumeParamsSchema = z.object({
  id: z.uuid(),
});

const adminResumeCandidateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
});

const adminResumeContentPreviewSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experienceCount: z.number().int().optional(),
  educationCount: z.number().int().optional(),
});

const adminResumeMatchItemSchema = z.object({
  id: z.uuid(),
  matchPct: z.number(),
  jobTitle: z.string(),
  company: z.string(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
});

export const adminResumeListItemSchema = z.object({
  id: z.uuid(),
  candidate: adminResumeCandidateSchema,
  title: z.string(),
  status: resumeStatusSchema,
  atsScore: nullableScoreSchema,
  grammarScore: nullableScoreSchema,
  suggestionsCount: z.number().int(),
  matchesCount: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const adminResumesListResponseSchema = z.object({
  data: z.array(adminResumeListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export const adminResumeDetailsResponseSchema = adminResumeListItemSchema
  .omit({ suggestionsCount: true, matchesCount: true })
  .extend({
    suggestions: z.array(z.string()),
    contentPreview: adminResumeContentPreviewSchema,
    matches: z.array(adminResumeMatchItemSchema),
  });

export type AdminResumesQuery = z.infer<typeof adminResumesQuerySchema>;
export type AdminResumeListItem = z.infer<typeof adminResumeListItemSchema>;
export type AdminResumeDetails = z.infer<
  typeof adminResumeDetailsResponseSchema
>;
export type AdminResumeContentPreview = z.infer<
  typeof adminResumeContentPreviewSchema
>;
