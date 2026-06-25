import { AbstractService } from "@/common/contracts";

export class DashboardService extends AbstractService {
  async getStats(userId: string) {
    const [interviewsCompleted, feedbackAgg, problemsSolved] =
      await Promise.all([
        this.prisma.interview.count({
          where: { userId, status: "COMPLETED" },
        }),
        this.prisma.answerFeedback.aggregate({
          _avg: { overallScore: true },
          where: {
            answer: { interview: { userId, status: "COMPLETED" } },
          },
        }),
        this.prisma.codingSubmission.count({
          where: { userId, status: "ACCEPTED" },
        }),
      ]);

    const interviewsForTime = await this.prisma.interview.findMany({
      where: { userId, status: "COMPLETED" },
      select: { startedAt: true, completedAt: true },
    });

    let practiceTimeMinutes = 0;
    for (const interview of interviewsForTime) {
      if (interview.startedAt && interview.completedAt) {
        const diff =
          interview.completedAt.getTime() - interview.startedAt.getTime();
        practiceTimeMinutes += Math.round(diff / 60000);
      }
    }

    return {
      interviewsCompleted,
      averageScore: feedbackAgg._avg.overallScore ?? 0,
      practiceTimeMinutes,
      problemsSolved,
    };
  }

  async getRecent(userId: string) {
    const [interviews, submissions] = await Promise.all([
      this.prisma.interview.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          category: true,
          difficulty: true,
          status: true,
          startedAt: true,
          completedAt: true,
          answers: {
            include: { feedback: { select: { overallScore: true } } },
          },
        },
      }),
      this.prisma.codingSubmission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          problem: { select: { title: true } },
          language: true,
          status: true,
          executionTimeMs: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      interviews: interviews.map((i) => ({
        id: i.id,
        category: i.category,
        difficulty: i.difficulty,
        status: i.status,
        score: this._averageScore(
          i.answers
            .flatMap((a) => a.feedback.map((f) => f.overallScore))
            .filter((s): s is number => s != null),
        ),
        completedAt: i.completedAt?.toISOString() ?? null,
        startedAt: i.startedAt.toISOString(),
      })),
      submissions: submissions.map((s) => ({
        id: s.id,
        problemTitle: s.problem.title,
        language: s.language,
        status: s.status,
        executionTimeMs: s.executionTimeMs,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  }

  async getSkills(userId: string) {
    const interviews = await this.prisma.interview.findMany({
      where: { userId, status: "COMPLETED" },
      select: {
        category: true,
        answers: {
          include: { feedback: { select: { overallScore: true } } },
        },
      },
    });

    const categoryMap = new Map<string, { total: number; count: number }>();

    for (const interview of interviews) {
      const scores = interview.answers
        .flatMap((a) => a.feedback.map((f) => f.overallScore))
        .filter((s): s is number => s != null);

      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const existing = categoryMap.get(interview.category);
        if (existing) {
          existing.total += avg;
          existing.count += 1;
        } else {
          categoryMap.set(interview.category, { total: avg, count: 1 });
        }
      }
    }

    return {
      categories: Array.from(categoryMap.entries())
        .map(([name, { total, count }]) => ({
          name,
          avgScore: Math.round((total / count) * 100),
          count,
        }))
        .sort((a, b) => b.avgScore - a.avgScore),
    };
  }

  async getGoals(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [interviewsDone, problemsDone, settings] = await Promise.all([
      this.prisma.interview.count({
        where: {
          userId,
          status: "COMPLETED",
          completedAt: { gte: startOfWeek },
        },
      }),
      this.prisma.codingSubmission.count({
        where: {
          userId,
          status: "ACCEPTED",
          createdAt: { gte: startOfWeek },
        },
      }),
      this.prisma.userSettings.findUnique({
        where: { userId },
        select: { interviewGoal: true, problemGoal: true },
      }),
    ]);

    return {
      interviewGoal: settings?.interviewGoal ?? 0,
      interviewsDone,
      problemGoal: settings?.problemGoal ?? 0,
      problemsDone,
    };
  }

  private _averageScore(scores: number[]): number | null {
    if (scores.length === 0) {
      return null;
    }

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}
