import { apiClient } from "@/services";

import type { ResumeData } from "../types";

export type ResumeRecord = {
  id: string;
  title: string;
  status: "DRAFT" | "COMPLETE" | "ARCHIVED";
  content: ResumeData;
  atsScore: number | null;
  grammarScore: number | null;
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
};

export type SaveResumeInput = {
  title?: string;
  content: ResumeData;
};

export const getMyResume = () => {
  return apiClient<ResumeRecord | null>("/api/resumes/me");
};

export const saveMyResume = (input: SaveResumeInput) => {
  return apiClient<ResumeRecord>("/api/resumes/me", {
    method: "PUT",
    json: input,
  });
};
