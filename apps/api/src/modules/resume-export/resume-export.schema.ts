import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().default("");

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => !value || isSafeHttpUrl(value), {
    message: "Invalid URL",
  });

function isSafeHttpUrl(value: string): boolean {
  if (/\s/.test(value) || /[\\{}<>]/.test(value)) return false;
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(candidate);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

function isBlankValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.every(isBlankValue);
  return false;
}

function compactEmptyRows(value: unknown): unknown {
  if (!Array.isArray(value)) return value;

  return value.filter((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      return true;

    const meaningfulValues = Object.entries(entry).filter(
      ([key]) => key !== "id",
    );
    return meaningfulValues.some(([, fieldValue]) => !isBlankValue(fieldValue));
  });
}

const personalInfoSchema = z.object({
  fullName: text(120).min(1, "Full name is required"),
  email: optionalText(254).refine(
    (value) => !value || EMAIL_PATTERN.test(value),
    {
      message: "Invalid email address",
    },
  ),
  phone: optionalText(32),
  location: optionalText(160),
  summary: optionalText(3000),
  linkedin: optionalUrl,
  github: optionalUrl,
});

const workExperienceSchema = z.object({
  id: optionalText(120),
  company: text(120).min(1),
  position: text(120).min(1),
  duration: optionalText(120),
  description: optionalText(3000),
});

const projectSchema = z.object({
  id: optionalText(120),
  name: text(120).min(1),
  role: optionalText(120),
  duration: optionalText(120),
  description: optionalText(3000),
  url: optionalUrl,
});

const educationSchema = z.object({
  id: optionalText(120),
  school: text(120).min(1),
  degree: text(160).min(1),
  year: optionalText(120),
});

const skillItemSchema = text(120).transform((value) => value.trim());

const skillCategorySchema = z.object({
  id: optionalText(120),
  category: text(120).min(1),
  items: z
    .array(skillItemSchema)
    .max(30)
    .transform((items) => items.filter(Boolean)),
});

const skillsSchema = z
  .union([
    z
      .array(skillItemSchema)
      .max(50)
      .transform((items) => items.filter(Boolean)),
    z
      .preprocess(compactEmptyRows, z.array(skillCategorySchema).max(20))
      .transform((items) => items.filter((item) => item.items.length > 0)),
  ])
  .optional()
  .default([]);

export const resumeExportInputSchema = z.object({
  content: z.object({
    personalInfo: personalInfoSchema,
    workExperience: z
      .preprocess(compactEmptyRows, z.array(workExperienceSchema).max(30))
      .optional()
      .default([]),
    projects: z
      .preprocess(compactEmptyRows, z.array(projectSchema).max(30))
      .optional()
      .default([]),
    education: z
      .preprocess(compactEmptyRows, z.array(educationSchema).max(20))
      .optional()
      .default([]),
    skills: skillsSchema,
  }),
});

export type ResumeExportInput = z.infer<typeof resumeExportInputSchema>;

const optimizedSkillSchema = z.object({
  category: text(120).min(1),
  items: z.array(text(120).min(1)).max(30),
});

const optimizedWorkExpSchema = z.object({
  company: text(120).min(1),
  position: text(120).min(1),
  duration: optionalText(120),
  description: optionalText(3000),
});

const optimizedProjectSchema = z.object({
  name: text(120).min(1),
  role: optionalText(120),
  duration: optionalText(120),
  description: optionalText(3000),
  url: optionalUrl,
});

const optimizedEducationSchema = z.object({
  school: text(120).min(1),
  degree: text(160).min(1),
  year: optionalText(120),
});

export const optimizedResumeSchema = z.object({
  personalInfo: z.object({
    fullName: text(120).min(1),
    email: optionalText(254),
    phone: optionalText(32),
    location: optionalText(160),
    summary: optionalText(3000),
    linkedin: optionalUrl,
    github: optionalUrl,
  }),
  workExperience: z
    .array(optimizedWorkExpSchema)
    .max(30)
    .optional()
    .default([]),
  projects: z.array(optimizedProjectSchema).max(30).optional().default([]),
  education: z.array(optimizedEducationSchema).max(20).optional().default([]),
  skills: z.array(optimizedSkillSchema).max(20).optional().default([]),
  summary: optionalText(3000),
});

export type OptimizedResumeOutput = z.infer<typeof optimizedResumeSchema>;
