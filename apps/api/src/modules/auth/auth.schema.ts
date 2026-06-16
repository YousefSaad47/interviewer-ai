import { faker } from "@faker-js/faker";
import { z } from "zod";

export const signInSchema = z
  .object({
    email: z.email().toLowerCase(),
    password: z.string().min(6),
  })
  .openapi("SignInSchema", {
    default: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

export type SignInBody = z.infer<typeof signInSchema>;
