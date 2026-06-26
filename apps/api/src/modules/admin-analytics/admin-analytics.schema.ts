import { z } from "zod";

const analyticsRangeSchema = z.enum(["7d", "30d", "90d"]);
const analyticsIntervalSchema = z.enum(["day", "week"]);

export const adminAnalyticsQuerySchema = z.object({
  range: analyticsRangeSchema.default("30d"),
  interval: analyticsIntervalSchema.default("day"),
});

const timeSeriesPointSchema = z.object({
  date: z.string(),
  count: z.number().int(),
});

const featureUsageSchema = z.object({
  feature: z.enum(["interviews", "coding", "resumes"]),
  count: z.number().int(),
});

export const adminAnalyticsResponseSchema = z.object({
  usersGrowth: z.array(timeSeriesPointSchema),
  interviewsActivity: z.array(timeSeriesPointSchema),
  codingActivity: z.array(timeSeriesPointSchema),
  resumeUsage: z.array(timeSeriesPointSchema),
  mostUsedFeatures: z.array(featureUsageSchema),
  completionRates: z.object({
    interviews: z.number(),
    codingAccepted: z.number(),
    resumesComplete: z.number(),
  }),
});

export type AdminAnalyticsQuery = z.infer<typeof adminAnalyticsQuerySchema>;
export type AdminAnalyticsResponse = z.infer<
  typeof adminAnalyticsResponseSchema
>;
export type AdminAnalyticsRange = z.infer<typeof analyticsRangeSchema>;
export type AdminAnalyticsInterval = z.infer<typeof analyticsIntervalSchema>;
export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;
export type FeatureUsage = z.infer<typeof featureUsageSchema>;
