import { faker } from "@faker-js/faker";
import { z } from "zod";

export const sampleSchema = z
  .object({
    name: z.string().min(1),
    age: z.number().min(18).max(100),
  })
  .openapi("Sample", {
    default: {
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 100 }),
    },
  });

export type Sample = z.infer<typeof sampleSchema>;
