import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .refine(
        (val) => val.length === 0 || val.length >= 2,
        "Full name must be at least 2 characters"
      )
      .refine(
        (val) => val.length === 0 || val.length <= 100,
        "Full name must be less than 100 characters"
      )
      .refine(
        (val) => val.length === 0 || /^[a-zA-Z\s]+$/.test(val),
        "Full name must contain only letters and spaces"
      ),
    email: z.email(),
    password: z
      .string()
      .refine(
        (val) => val.length === 0 || val.length >= 8,
        "Password must be at least 8 characters"
      )
      .refine(
        (val) => val.length === 0 || val.length <= 100,
        "Password must be less than 100 characters"
      )
      .refine(
        (val) =>
          val.length === 0 || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password.length === 0 ||
      data.confirmPassword.length === 0 ||
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type SignUpFormData = z.infer<typeof signUpSchema>;
