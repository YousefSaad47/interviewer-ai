import { z } from "zod";

/**
 * Strict validation schema for form submission
 * Use this when user clicks submit button
 */
export const verifyCodeSubmitSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});

export type VerifyCodeSubmitFormData = z.infer<typeof verifyCodeSubmitSchema>;
