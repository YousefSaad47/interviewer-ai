export const ADMIN_CODING_SCORE_PRECISION = 2;

type NullableScore = number | null;

export type AdminCodingScoreInput = {
  logicScore: NullableScore;
  namingScore: NullableScore;
  efficiencyScore: NullableScore;
  bestPracticesScore: NullableScore;
  problem: {
    logicWeight: number;
    namingWeight: number;
    efficiencyWeight: number;
    bestPracticesWeight: number;
  };
};

export const calculateCodingScore = (
  submission: AdminCodingScoreInput,
): NullableScore => {
  const scoredWeights = [
    { score: submission.logicScore, weight: submission.problem.logicWeight },
    { score: submission.namingScore, weight: submission.problem.namingWeight },
    {
      score: submission.efficiencyScore,
      weight: submission.problem.efficiencyWeight,
    },
    {
      score: submission.bestPracticesScore,
      weight: submission.problem.bestPracticesWeight,
    },
  ].filter(
    (item): item is { score: number; weight: number } =>
      item.score !== null && item.weight > 0,
  );

  const totalWeight = scoredWeights.reduce(
    (total, item) => total + item.weight,
    0,
  );

  if (totalWeight <= 0) {
    return null;
  }

  const weightedScore =
    scoredWeights.reduce((total, item) => total + item.score * item.weight, 0) /
    totalWeight;

  return roundScore(weightedScore);
};

const roundScore = (score: number): number => {
  const precision = 10 ** ADMIN_CODING_SCORE_PRECISION;
  return Math.round(score * precision) / precision;
};
