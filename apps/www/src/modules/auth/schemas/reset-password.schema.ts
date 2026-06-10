import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .refine(
        (val) => val.length === 0 || val.length >= 8,
        "Password must be at least 8 characters",
      )
      .refine(
        (val) => val.length === 0 || val.length <= 100,
        "Password must be less than 100 characters",
      )
      .refine(
        (val) =>
          val.length === 0 || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.newPassword.length === 0 ||
      data.confirmPassword.length === 0 ||
      data.newPassword === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
