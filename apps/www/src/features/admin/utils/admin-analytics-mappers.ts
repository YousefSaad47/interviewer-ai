import type { AdminAnalyticsResponse, AdminStat, FeatureUsage } from "../types";

const featureLabels = {
  interviews: "Mock Interviews",
  coding: "Coding Sessions",
  resumes: "Resume Analyses",
} as const;

export const sumSeries = (series: readonly { count: number }[]) =>
  series.reduce((total, point) => total + point.count, 0);

export const toChartValues = (series: readonly { count: number }[]) =>
  series.map((point) => point.count);

export const buildAdminStats = (
  analytics: AdminAnalyticsResponse | undefined,
): AdminStat[] => [
  {
    label: "Total Users",
    value: String(sumSeries(analytics?.usersGrowth ?? [])),
    change: "30d",
    caption: "New accounts in selected range",
  },
  {
    label: "Mock Interviews",
    value: String(sumSeries(analytics?.interviewsActivity ?? [])),
    change: `${analytics?.completionRates.interviews ?? 0}%`,
    caption: "Interview sessions in selected range",
  },
  {
    label: "Coding Sessions",
    value: String(sumSeries(analytics?.codingActivity ?? [])),
    change: `${analytics?.completionRates.codingAccepted ?? 0}%`,
    caption: "Submissions in selected range",
  },
  {
    label: "Resume Analyses",
    value: String(sumSeries(analytics?.resumeUsage ?? [])),
    change: `${analytics?.completionRates.resumesComplete ?? 0}%`,
    caption: "Resumes created in selected range",
  },
];

export const buildReadinessIndex = (
  analytics: AdminAnalyticsResponse | undefined,
) => {
  if (!analytics) {
    return 0;
  }

  const values = [
    analytics.completionRates.interviews,
    analytics.completionRates.codingAccepted,
    analytics.completionRates.resumesComplete,
  ];

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
};

export const buildFeatureUsage = (
  analytics: AdminAnalyticsResponse | undefined,
): FeatureUsage[] => {
  const total = analytics
    ? analytics.mostUsedFeatures.reduce((sum, item) => sum + item.count, 0)
    : 0;

  return (
    analytics?.mostUsedFeatures.map((item) => [
      featureLabels[item.feature],
      total > 0 ? Math.round((item.count / total) * 100) : 0,
    ]) ?? []
  );
};

export const buildRecentActivity = (
  analytics: AdminAnalyticsResponse | undefined,
) => [
  `Users created: ${sumSeries(analytics?.usersGrowth ?? [])}`,
  `Interview completion: ${analytics?.completionRates.interviews ?? 0}%`,
  `Coding acceptance: ${analytics?.completionRates.codingAccepted ?? 0}%`,
  `Resume completion: ${analytics?.completionRates.resumesComplete ?? 0}%`,
];
