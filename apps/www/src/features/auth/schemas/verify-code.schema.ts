import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type VerifyCodeSubmitFormData = VerifyCodeFormData;
