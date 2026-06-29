import { AbstractService } from "@/common/contracts";

export class DashboardService extends AbstractService {
  async getStats(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [interviewsCompleted, feedbackAgg, problemsSolved, settings] =
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
        this.prisma.userSettings.findUnique({
          where: { userId },
          select: { interviewGoal: true, problemGoal: true },
        }),
      ]);

    const [interviewsForTime, interviewsDone, problemsDone] = await Promise.all(
      [
        this.prisma.interview.findMany({
          where: { userId, status: "COMPLETED" },
          select: { startedAt: true, completedAt: true },
        }),
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
      ],
    );

    let practiceTimeMinutes = 0;
    for (const interview of interviewsForTime) {
      if (interview.startedAt && interview.completedAt) {
        const diff =
          interview.completedAt.getTime() - interview.startedAt.getTime();
        practiceTimeMinutes += Math.round(diff / 60000);
      }
    }

    const avgScore = feedbackAgg._avg.overallScore ?? 0;
    const interviewGoal = settings?.interviewGoal ?? 3;
    const problemGoal = settings?.problemGoal ?? 5;
    const interviewProgress =
      interviewGoal > 0 ? Math.min(interviewsDone / interviewGoal, 1) : 0;
    const problemProgress =
      problemGoal > 0 ? Math.min(problemsDone / problemGoal, 1) : 0;
    const readinessScore = Math.round(
      avgScore * 0.4 + interviewProgress * 30 + problemProgress * 30,
    );

    let nextBestMove: string;
    if (interviewsCompleted === 0) {
      nextBestMove = "Start a 20 minute mock session.";
    } else if (avgScore < 60) {
      nextBestMove = "Review weak signals from your last interview.";
    } else if (problemsSolved === 0) {
      nextBestMove = "Sharpen your skills with a coding challenge.";
    } else if (interviewsDone >= interviewGoal && problemsDone >= problemGoal) {
      nextBestMove = "Outstanding! You've crushed your goals for this week.";
    } else if (problemsDone < problemGoal) {
      nextBestMove = "Solve another coding problem to reach your weekly goal.";
    } else {
      nextBestMove = "Continue your practice with a mock interview.";
    }

    return {
      interviewsCompleted,
      averageScore: avgScore,
      practiceTimeMinutes,
      problemsSolved,
      readinessScore,
      nextBestMove,
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

    // Compute streak from all activity dates
    const dates = new Set<string>();
    for (const i of interviews) {
      if (i.startedAt) {
        dates.add(i.startedAt.toDateString());
      }
    }
    for (const s of submissions) {
      if (s.createdAt) {
        dates.add(s.createdAt.toDateString());
      }
    }
    let streak = 0;
    const checkDate = new Date();
    if (!dates.has(checkDate.toDateString())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (dates.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

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
      streak,
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

    const categories = Array.from(categoryMap.entries())
      .map(([name, { total, count }]) => ({
        name,
        avgScore: Math.round((total / count) * 100),
        count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    const focusArea =
      categories.length > 0
        ? categories[0]?.name.replace(/_/g, " ")
        : "System design";

    return { categories, focusArea };
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
