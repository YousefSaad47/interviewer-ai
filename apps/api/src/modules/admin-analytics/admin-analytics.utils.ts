import type {
  AdminAnalyticsInterval,
  AdminAnalyticsRange,
  FeatureUsage,
  TimeSeriesPoint,
} from "./admin-analytics.schema";

export type AnalyticsWindow = {
  start: Date;
  endExclusive: Date;
  interval: AdminAnalyticsInterval;
  buckets: string[];
};

type CountByDate = {
  date: string;
  count: number;
};

const RANGE_DAYS: Record<AdminAnalyticsRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const createAnalyticsWindow = (
  range: AdminAnalyticsRange,
  interval: AdminAnalyticsInterval,
  now = new Date(),
): AnalyticsWindow => {
  const endExclusive = startOfUtcDay(addUtcDays(now, 1));
  const start = addUtcDays(endExclusive, -RANGE_DAYS[range]);

  return {
    start,
    endExclusive,
    interval,
    buckets:
      interval === "day"
        ? createDailyBuckets(start, endExclusive)
        : createWeeklyBuckets(start, endExclusive),
  };
};

export const fillTimeSeries = (
  buckets: readonly string[],
  counts: readonly CountByDate[],
): TimeSeriesPoint[] => {
  const countByDate = new Map(
    counts.map((item) => [item.date, item.count] as const),
  );

  return buckets.map((date) => ({
    date,
    count: countByDate.get(date) ?? 0,
  }));
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }

  return roundPercentage((part / total) * 100);
};

export const sortFeatureUsage = (
  usage: readonly FeatureUsage[],
): FeatureUsage[] =>
  [...usage].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.feature.localeCompare(right.feature);
  });

const createDailyBuckets = (start: Date, endExclusive: Date): string[] => {
  const buckets: string[] = [];

  for (
    let current = startOfUtcDay(start);
    current < endExclusive;
    current = addUtcDays(current, 1)
  ) {
    buckets.push(formatUtcDate(current));
  }

  return buckets;
};

const createWeeklyBuckets = (start: Date, endExclusive: Date): string[] => {
  const buckets: string[] = [];
  const firstWeek = startOfUtcWeek(start);

  for (
    let current = firstWeek;
    current < endExclusive;
    current = addUtcDays(current, 7)
  ) {
    buckets.push(formatUtcDate(current));
  }

  return buckets;
};

const startOfUtcDay = (date: Date): Date =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

const startOfUtcWeek = (date: Date): Date => {
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addUtcDays(startOfUtcDay(date), mondayOffset);
};

const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const formatUtcDate = (date: Date): string => date.toISOString().slice(0, 10);

const roundPercentage = (value: number): number => {
  const precision = 100;
  return Math.round(value * precision) / precision;
};
