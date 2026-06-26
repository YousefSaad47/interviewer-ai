import { AbstractService } from "@/common/contracts";
import type { PrismaClient } from "@/generated/client";

import { AdminAnalyticsRepository } from "./admin-analytics.repository";
import type {
  AdminAnalyticsQuery,
  AdminAnalyticsResponse,
  FeatureUsage,
} from "./admin-analytics.schema";
import {
  calculatePercentage,
  createAnalyticsWindow,
  fillTimeSeries,
  sortFeatureUsage,
} from "./admin-analytics.utils";

export class AdminAnalyticsService extends AbstractService {
  private readonly repository: AdminAnalyticsRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminAnalyticsRepository(prisma);
  }

  public async getAnalytics(
    query: AdminAnalyticsQuery,
    _adminUserId: string,
  ): Promise<AdminAnalyticsResponse> {
    const window = createAnalyticsWindow(query.range, query.interval);

    const [
      usersGrowth,
      interviewsActivity,
      codingActivity,
      resumeUsage,
      featureUsageCounts,
      completionRateCounts,
    ] = await Promise.all([
      this.repository.getUsersGrowth(
        window.interval,
        window.start,
        window.endExclusive,
      ),
      this.repository.getInterviewsActivity(
        window.interval,
        window.start,
        window.endExclusive,
      ),
      this.repository.getCodingActivity(
        window.interval,
        window.start,
        window.endExclusive,
      ),
      this.repository.getResumeUsage(
        window.interval,
        window.start,
        window.endExclusive,
      ),
      this.repository.getFeatureUsageCounts(window.start, window.endExclusive),
      this.repository.getCompletionRateCounts(
        window.start,
        window.endExclusive,
      ),
    ]);

    const mostUsedFeatures: FeatureUsage[] = sortFeatureUsage([
      { feature: "interviews", count: featureUsageCounts.interviews },
      { feature: "coding", count: featureUsageCounts.coding },
      { feature: "resumes", count: featureUsageCounts.resumes },
    ]);

    return {
      usersGrowth: fillTimeSeries(window.buckets, mapCountRows(usersGrowth)),
      interviewsActivity: fillTimeSeries(
        window.buckets,
        mapCountRows(interviewsActivity),
      ),
      codingActivity: fillTimeSeries(
        window.buckets,
        mapCountRows(codingActivity),
      ),
      resumeUsage: fillTimeSeries(window.buckets, mapCountRows(resumeUsage)),
      mostUsedFeatures,
      completionRates: {
        interviews: calculatePercentage(
          completionRateCounts.interviewsCompleted,
          completionRateCounts.interviewsTotal,
        ),
        codingAccepted: calculatePercentage(
          completionRateCounts.codingAccepted,
          completionRateCounts.codingTotal,
        ),
        resumesComplete: calculatePercentage(
          completionRateCounts.resumesComplete,
          completionRateCounts.resumesTotal,
        ),
      },
    };
  }
}

const mapCountRows = (rows: readonly { date: string; count: bigint }[]) =>
  rows.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));
