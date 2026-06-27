import { z } from "zod";

const personalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  summary: z.string(),
});

const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  duration: z.string(),
  description: z.string(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  duration: z.string(),
  description: z.string(),
});

const educationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  year: z.string(),
});

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
});

export const resumeSaveSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  content: resumeContentSchema,
});

export const resumeResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  status: z.enum(["DRAFT", "COMPLETE", "ARCHIVED"]),
  content: resumeContentSchema,
  atsScore: z.number().nullable(),
  grammarScore: z.number().nullable(),
  suggestions: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const resumeNullableResponseSchema = resumeResponseSchema.nullable();

export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type ResumeSaveInput = z.infer<typeof resumeSaveSchema>;
