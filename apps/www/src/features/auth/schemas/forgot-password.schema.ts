import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordSubmitFormData = ForgotPasswordFormData;
