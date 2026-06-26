import type { InterviewSetupFormData } from "../schemas";
import type { InterviewCategory, InterviewDifficulty } from "../types";
import { INTERVIEW_QUESTION_COUNT } from "./interview-setup-options";

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
  questionCount: INTERVIEW_QUESTION_COUNT,
  targetRole: data.targetRole,
  experienceLevel: data.experienceLevel,
  interviewFocus: data.interviewFocus,
  ...(data.additionalContext && {
    additionalContext: data.additionalContext,
  }),
});
