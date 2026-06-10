import { z } from "zod";

/**
 * Strict validation schema for form submission
 * Use this when user clicks submit button
 */
export const signInSubmitSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInSubmitFormData = z.infer<typeof signInSubmitSchema>;
