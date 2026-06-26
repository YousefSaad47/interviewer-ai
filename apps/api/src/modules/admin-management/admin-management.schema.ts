import { z } from "zod";

export const ADMIN_ACCOUNTS_DEFAULT_LIMIT = 10;
export const ADMIN_ACCOUNTS_MAX_LIMIT = 50;

const adminRoleSchema = z.enum(["ADMIN", "SUPER_ADMIN"]);
const adminStatusSchema = z.enum(["ACTIVE", "DISABLED"]);

export const adminAccountsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  status: adminStatusSchema.optional(),
  role: adminRoleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_ACCOUNTS_MAX_LIMIT)
    .default(ADMIN_ACCOUNTS_DEFAULT_LIMIT),
});

export const adminAccountParamsSchema = z.object({
  id: z.uuid(),
});

export const promoteAdminBodySchema = z.object({
  userId: z.uuid(),
  role: adminRoleSchema,
});

export const updateAdminBodySchema = z
  .object({
    role: adminRoleSchema.optional(),
    status: adminStatusSchema.optional(),
  })
  .refine((value) => value.role !== undefined || value.status !== undefined, {
    message: "At least one of role or status must be provided",
  });

export const adminAccountListItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  role: adminRoleSchema,
  status: adminStatusSchema,
  createdAt: z.iso.datetime(),
  lastLoginAt: z.iso.datetime().nullable(),
});

export const adminAccountsListResponseSchema = z.object({
  data: z.array(adminAccountListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export const adminAccountMutationResponseSchema = z.object({
  id: z.uuid(),
  role: adminRoleSchema,
  status: adminStatusSchema,
});

export const removeAdminAccessResponseSchema = z.object({
  success: z.literal(true),
});

export type AdminAccountsQuery = z.infer<typeof adminAccountsQuerySchema>;
export type PromoteAdminBody = z.infer<typeof promoteAdminBodySchema>;
export type UpdateAdminBody = z.infer<typeof updateAdminBodySchema>;
export type AdminAccountListItem = z.infer<typeof adminAccountListItemSchema>;
export type AdminAccountMutationResponse = z.infer<
  typeof adminAccountMutationResponseSchema
>;
export type RemoveAdminAccessResponse = z.infer<
  typeof removeAdminAccessResponseSchema
>;
