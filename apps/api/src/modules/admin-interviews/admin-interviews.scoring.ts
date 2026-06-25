export const ADMIN_INTERVIEW_SCORE_PRECISION = 2;

type NullableScore = number | null;

export type OverallScoreFeedback = {
  overallScore: NullableScore;
};

export type BreakdownScoreFeedback = {
  fluencyScore: NullableScore;
  clarityScore: NullableScore;
  confidenceScore: NullableScore;
  relevanceScore: NullableScore;
  technicalAccuracy: NullableScore;
};

export type AdminInterviewScoreBreakdown = {
  communication: NullableScore;
  technical: NullableScore;
  confidence: NullableScore;
};

export const calculateAverageScore = (
  values: readonly NullableScore[],
): NullableScore => {
  const scoredValues = values.filter(
    (value): value is number => value !== null,
  );

  if (scoredValues.length === 0) {
    return null;
  }

  const average =
    scoredValues.reduce((total, value) => total + value, 0) /
    scoredValues.length;

  return roundScore(average);
};

export const calculateOverallScore = (
  feedback: readonly OverallScoreFeedback[],
): NullableScore =>
  calculateAverageScore(feedback.map((item) => item.overallScore));

export const calculateScoreBreakdown = (
  feedback: readonly BreakdownScoreFeedback[],
): AdminInterviewScoreBreakdown => ({
  communication: calculateAverageScore(
    feedback.flatMap((item) => [item.fluencyScore, item.clarityScore]),
  ),
  technical: calculateAverageScore(
    feedback.flatMap((item) => [item.technicalAccuracy, item.relevanceScore]),
  ),
  confidence: calculateAverageScore(
    feedback.map((item) => item.confidenceScore),
  ),
});

export const calculateDurationSeconds = (
  startedAt: Date,
  completedAt: Date | null,
): number | null => {
  if (!completedAt) {
    return null;
  }

  return Math.max(
    0,
    Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000),
  );
};

const roundScore = (score: number): number => {
  const precision = 10 ** ADMIN_INTERVIEW_SCORE_PRECISION;
  return Math.round(score * precision) / precision;
};
