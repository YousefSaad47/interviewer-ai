import { z } from "zod";

export const interviewSetupSchema = z.object({
  targetRole: z.string().min(1, "Please select a target role"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  interviewFocus: z.string().min(1, "Please select an interview focus"),
  additionalContext: z
    .string()
    .max(500, "Additional context must not exceed 500 characters")
    .optional(),
});

export type InterviewSetupFormData = z.infer<typeof interviewSetupSchema>;
