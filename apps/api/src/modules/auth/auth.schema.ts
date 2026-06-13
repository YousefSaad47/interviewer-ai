import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type SignInBody = z.infer<typeof signInSchema>;
