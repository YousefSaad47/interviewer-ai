import type { InterviewSetupFormData } from "../schemas";
import type { InterviewCategory, InterviewDifficulty } from "../types";

const FOCUS_TO_CATEGORY: Record<string, InterviewCategory> = {
  algorithms: "ALGORITHMS",
  "system-design": "SYSTEM_DESIGN",
  behavioral: "BEHAVIORAL",
  coding: "FRONTEND",
  architecture: "SYSTEM_DESIGN",
  debugging: "ALGORITHMS",
};

const LEVEL_TO_DIFFICULTY: Record<string, InterviewDifficulty> = {
  entry: "EASY",
  mid: "EASY",
  senior: "MEDIUM",
  lead: "HARD",
  staff: "HARD",
};

export const mapInterviewSetupToRequest = (data: InterviewSetupFormData) => ({
  category: FOCUS_TO_CATEGORY[data.interviewFocus] ?? "BEHAVIORAL",
  difficulty: LEVEL_TO_DIFFICULTY[data.experienceLevel] ?? "EASY",
  questionCount: 5,
  targetRole: data.targetRole,
  experienceLevel: data.experienceLevel,
  interviewFocus: data.interviewFocus,
  ...(data.additionalContext && {
    additionalContext: data.additionalContext,
  }),
});
