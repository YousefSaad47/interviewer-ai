import { z } from "zod";

/**
 * Strict validation schema for form submission
 * Use this when user clicks submit button
 */
export const forgotPasswordSubmitSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

export type ForgotPasswordSubmitFormData = z.infer<
  typeof forgotPasswordSubmitSchema
>;
