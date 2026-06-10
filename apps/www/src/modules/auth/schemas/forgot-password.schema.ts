import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
