import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .refine(
      (val) => val.length === 0 || val.length === 6,
      "Code must be exactly 6 digits",
    )
    .refine(
      (val) => val.length === 0 || /^\d{6}$/.test(val),
      "Code must contain only numbers",
    ),
});

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
