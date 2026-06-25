import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: z.email().min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must not exceed 100 characters"),
  duration: z
    .string()
    .min(2, "Duration must be at least 2 characters")
    .max(50, "Duration must not exceed 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
});

export const educationSchema = z.object({
  id: z.string(),
  school: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must not exceed 100 characters"),
  degree: z
    .string()
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must not exceed 100 characters"),
  year: z
    .string()
    .regex(/^\d{4}(-\d{4})?$/, "Year must be in format YYYY or YYYY-YYYY"),
});

export const skillSchema = z
  .string()
  .min(2, "Skill must be at least 2 characters")
  .max(50, "Skill must not exceed 50 characters");

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
