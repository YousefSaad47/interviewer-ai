import { INTERVIEW_QUESTION_COUNT } from "./interview-setup-options";

export const parseInterviewQuestionCount = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return INTERVIEW_QUESTION_COUNT;
  }

  return parsed;
};

export const calculateInterviewProgress = (
  currentQuestion: number,
  questionCount: number,
) => {
  if (questionCount <= 0) {
    return 0;
  }

  return Math.min(Math.round((currentQuestion / questionCount) * 100), 100);
};
