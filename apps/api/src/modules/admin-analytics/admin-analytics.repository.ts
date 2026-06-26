import { Prisma, type PrismaClient } from "@/generated/client";

import type { AdminAnalyticsInterval } from "./admin-analytics.schema";

export type AnalyticsCountRow = {
  date: string;
  count: bigint;
};

export type AnalyticsFeatureUsageCounts = {
  interviews: number;
  coding: number;
  resumes: number;
};

export type AnalyticsCompletionRateCounts = {
  interviewsTotal: number;
  interviewsCompleted: number;
  codingTotal: number;
  codingAccepted: number;
  resumesTotal: number;
  resumesComplete: number;
};

export class AdminAnalyticsRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public getUsersGrowth(
    interval: AdminAnalyticsInterval,
    start: Date,
    endExclusive: Date,
  ) {
    return this._getTimeSeriesCounts(
      "users",
      "created_at",
      interval,
      start,
      endExclusive,
    );
  }

  public getInterviewsActivity(
    interval: AdminAnalyticsInterval,
    start: Date,
    endExclusive: Date,
  ) {
    return this._getTimeSeriesCounts(
      "interviews",
      "started_at",
      interval,
      start,
      endExclusive,
    );
  }

  public getCodingActivity(
    interval: AdminAnalyticsInterval,
    start: Date,
    endExclusive: Date,
  ) {
    return this._getTimeSeriesCounts(
      "coding_submissions",
      "created_at",
      interval,
      start,
      endExclusive,
    );
  }

  public getResumeUsage(
    interval: AdminAnalyticsInterval,
    start: Date,
    endExclusive: Date,
  ) {
    return this._getTimeSeriesCounts(
      "resumes",
      "created_at",
      interval,
      start,
      endExclusive,
    );
  }

  public async getFeatureUsageCounts(
    start: Date,
    endExclusive: Date,
  ): Promise<AnalyticsFeatureUsageCounts> {
    const [interviews, coding, resumes] = await Promise.all([
      this.prisma.interview.count({
        where: { startedAt: { gte: start, lt: endExclusive } },
      }),
      this.prisma.codingSubmission.count({
        where: { createdAt: { gte: start, lt: endExclusive } },
      }),
      this.prisma.resume.count({
        where: { createdAt: { gte: start, lt: endExclusive } },
      }),
    ]);

    return { interviews, coding, resumes };
  }

  public async getCompletionRateCounts(
    start: Date,
    endExclusive: Date,
  ): Promise<AnalyticsCompletionRateCounts> {
    const [
      interviewsTotal,
      interviewsCompleted,
      codingTotal,
      codingAccepted,
      resumesTotal,
      resumesComplete,
    ] = await Promise.all([
      this.prisma.interview.count({
        where: { startedAt: { gte: start, lt: endExclusive } },
      }),
      this.prisma.interview.count({
        where: {
          startedAt: { gte: start, lt: endExclusive },
          status: "COMPLETED",
        },
      }),
      this.prisma.codingSubmission.count({
        where: { createdAt: { gte: start, lt: endExclusive } },
      }),
      this.prisma.codingSubmission.count({
        where: {
          createdAt: { gte: start, lt: endExclusive },
          status: "ACCEPTED",
        },
      }),
      this.prisma.resume.count({
        where: { createdAt: { gte: start, lt: endExclusive } },
      }),
      this.prisma.resume.count({
        where: {
          createdAt: { gte: start, lt: endExclusive },
          status: "COMPLETE",
        },
      }),
    ]);

    return {
      interviewsTotal,
      interviewsCompleted,
      codingTotal,
      codingAccepted,
      resumesTotal,
      resumesComplete,
    };
  }

  private _getTimeSeriesCounts(
    table: "users" | "interviews" | "coding_submissions" | "resumes",
    dateColumn: "created_at" | "started_at",
    interval: AdminAnalyticsInterval,
    start: Date,
    endExclusive: Date,
  ): Promise<AnalyticsCountRow[]> {
    return this.prisma.$queryRaw<AnalyticsCountRow[]>`
      SELECT
        to_char(
          date_trunc(${interval}, ${Prisma.raw(`"${dateColumn}"`)} AT TIME ZONE 'UTC'),
          'YYYY-MM-DD'
        ) AS date,
        COUNT(*) AS count
      FROM ${Prisma.raw(`"${table}"`)}
      WHERE ${Prisma.raw(`"${dateColumn}"`)} >= ${start}
        AND ${Prisma.raw(`"${dateColumn}"`)} < ${endExclusive}
      GROUP BY date
      ORDER BY date ASC
    `;
  }
}
