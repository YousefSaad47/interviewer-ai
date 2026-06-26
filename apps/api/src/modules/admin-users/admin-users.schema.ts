import { z } from "zod";

export const ADMIN_USERS_DEFAULT_LIMIT = 10;
export const ADMIN_USERS_MAX_LIMIT = 50;
export const ADMIN_USERS_RECENT_ACTIVITY_LIMIT = 5;

const userRoleSchema = z.enum(["USER", "ADMIN", "SUPER_ADMIN"]);
const userStatusSchema = z.enum(["ACTIVE", "DISABLED"]);

export const adminUsersQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  status: userStatusSchema.optional(),
  role: userRoleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_USERS_MAX_LIMIT)
    .default(ADMIN_USERS_DEFAULT_LIMIT),
});

export const adminUserParamsSchema = z.object({
  id: z.uuid(),
});

export const adminUserStatusBodySchema = z.object({
  status: userStatusSchema,
});

const adminUserActivityCountsSchema = z.object({
  interviews: z.number().int(),
  codingSessions: z.number().int(),
  resumes: z.number().int(),
});

export const adminUserListItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.iso.datetime(),
  activity: adminUserActivityCountsSchema,
});

export const adminUsersListResponseSchema = z.object({
  data: z.array(adminUserListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

const adminUserActivityItemSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.uuid(),
    type: z.literal("INTERVIEW"),
    title: z.string(),
    status: z.string(),
    createdAt: z.iso.datetime(),
  }),
  z.object({
    id: z.uuid(),
    type: z.literal("CODING_SUBMISSION"),
    title: z.string(),
    status: z.string(),
    createdAt: z.iso.datetime(),
  }),
  z.object({
    id: z.uuid(),
    type: z.literal("RESUME"),
    title: z.string(),
    status: z.string(),
    createdAt: z.iso.datetime(),
  }),
]);

export const adminUserDetailsResponseSchema = adminUserListItemSchema
  .extend({
    updatedAt: z.iso.datetime(),
    lastLoginAt: z.iso.datetime().nullable(),
    recentActivity: z.array(adminUserActivityItemSchema),
  })
  .omit({ activity: true })
  .extend({
    activity: adminUserActivityCountsSchema,
  });

export const adminUserStatusResponseSchema = z.object({
  id: z.uuid(),
  status: userStatusSchema,
});

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>;
export type AdminUserStatusBody = z.infer<typeof adminUserStatusBodySchema>;
export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;
export type AdminUserDetails = z.infer<typeof adminUserDetailsResponseSchema>;
export type AdminUserStatusResponse = z.infer<
  typeof adminUserStatusResponseSchema
>;
export type AdminUserActivityItem = z.infer<typeof adminUserActivityItemSchema>;
