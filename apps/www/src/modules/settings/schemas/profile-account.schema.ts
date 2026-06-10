import { z } from "zod";

export const profileAccountSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: z.email().min(1, "Email is required"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (e.g., +1 555-123-4567)",
    )
    .optional()
    .or(z.literal("")),
  currentRole: z
    .string()
    .min(2, "Current role must be at least 2 characters")
    .max(100, "Current role must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  targetRole: z
    .string()
    .min(2, "Target role must be at least 2 characters")
    .max(100, "Target role must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  experience: z.string().optional(),
});

export type ProfileAccountFormData = z.infer<typeof profileAccountSchema>;
