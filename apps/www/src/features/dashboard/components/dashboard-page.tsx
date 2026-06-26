"use client";

import Link from "next/link";

import { Header } from "@/features/landing";
import { authClient } from "@/services";
import { Button } from "@/shared/ui";

import {
  QuickActions,
  RecentInterviews,
  SkillsOverview,
  StatsCards,
  WeeklyGoals,
} from "../components";
import {
  useDashboardGoals,
  useDashboardRecent,
  useDashboardSkills,
  useDashboardStats,
} from "../hooks";

export function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { data: stats } = useDashboardStats();
  const { data: recent } = useDashboardRecent();
  const { data: skills } = useDashboardSkills();
  const { data: goals } = useDashboardGoals();

  const firstName = session?.user?.name?.split(" ")[0] ?? "Developer";

  // Calculate Streak
  const streak = (() => {
    if (!recent) return 0;
    const dates = new Set<string>();
    recent.interviews?.forEach((i) => {
      if (i.startedAt) {
        dates.add(new Date(i.startedAt).toDateString());
      }
    });
    recent.submissions?.forEach((s) => {
      if (s.createdAt) {
        dates.add(new Date(s.createdAt).toDateString());
      }
    });

    let count = 0;
    const checkDate = new Date();

    // If there is no activity today, check if there was activity yesterday to continue the streak
    if (!dates.has(checkDate.toDateString())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (dates.has(checkDate.toDateString())) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return count;
  })();

  const streakText =
    streak > 0 ? `${streak} day${streak === 1 ? "" : "s"}` : "Ready";

  // Calculate Focus Skill Area
  const focusArea = (() => {
    if (skills?.categories && skills.categories.length > 0) {
      return skills.categories[0]?.name?.replace("_", " ") ?? "System design";
    }
    return "System design";
  })();

  // Calculate Target Sessions
  const interviewGoal = goals?.interviewGoal ?? 3;
  const targetText = `${interviewGoal} session${interviewGoal === 1 ? "" : "s"}`;

  // Calculate Readiness Pulse
  const avgScore = stats?.averageScore ?? 0;
  const interviewsDone = goals?.interviewsDone ?? 0;
  const problemsDone = goals?.problemsDone ?? 0;
  const problemGoal = goals?.problemGoal ?? 5;

  const interviewProgress =
    interviewGoal > 0 ? Math.min(interviewsDone / interviewGoal, 1) : 0;
  const problemProgress =
    problemGoal > 0 ? Math.min(problemsDone / problemGoal, 1) : 0;

  const readinessScore = Math.round(
    avgScore * 0.4 + interviewProgress * 30 + problemProgress * 30,
  );

  const angle = Math.round((readinessScore / 100) * 360);

  // Formatted Practice Time text
  const practiceTimeText = (() => {
    const mins = stats?.practiceTimeMinutes ?? 0;
    if (mins === 0) return "0h";
    if (mins < 60) return `${mins}m`;
    return `${Math.round(mins / 60)}h`;
  })();

  // Determine Next Best Move dynamically
  const nextBestMove = (() => {
    if (!stats || stats.interviewsCompleted === 0) {
      return "Start a 20 minute mock session.";
    }
    if (avgScore < 60) {
      return "Review weak signals from your last interview.";
    }
    if (stats.problemsSolved === 0) {
      return "Sharpen your skills with a coding challenge.";
    }
    if (interviewsDone >= interviewGoal && problemsDone >= problemGoal) {
      return "Outstanding! You've crushed your goals for this week.";
    }
    if (problemsDone < problemGoal) {
      return "Solve another coding problem to reach your weekly goal.";
    }
    return "Continue your practice with a mock interview.";
  })();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Header />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24] dark:opacity-[0.16]"
        style={{
          backgroundImage: "url('/mesh.svg')",
          backgroundSize: "cover",
        }}
      />

      <div
        className="pointer-events-none absolute opacity-35 dark:opacity-70"
        style={{
          left: "-517px",
          top: "-385px",
          width: "660px",
          height: "665px",
          background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          filter: "blur(250px)",
        }}
      />
      <div
        className="pointer-events-none absolute opacity-30 dark:opacity-65"
        style={{
          right: "-180px",
          top: "423px",
          width: "390px",
          height: "393px",
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.28) 0%, transparent 70%)",
          filter: "blur(358.5px)",
        }}
      />

      <main className="relative mx-auto w-full max-w-[1480px] px-4 pt-28 pb-20 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <section className="mb-6 overflow-hidden rounded-lg border border-border bg-card/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute top-0 right-0 h-56 w-56 translate-x-16 -translate-y-20 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute right-10 bottom-8 hidden h-32 w-32 rounded-full border border-primary/10 lg:block">
                <div className="absolute inset-4 rounded-full border border-primary/15" />
                <div className="absolute inset-9 rounded-full bg-primary/10 blur-sm" />
              </div>
              <div className="relative max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
                  Prep dashboard
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Today
                </div>
                <h1 className="max-w-2xl font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
                  Keep your interview practice, coding reps, and resume work in
                  one focused workspace.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="h-11 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-[0_14px_35px_rgba(16,185,129,0.22)] hover:bg-primary/90"
                  >
                    <Link href="/interview/setup">Start interview</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-lg border-border bg-white/65 px-5 font-semibold text-foreground hover:border-primary/30 hover:bg-card dark:bg-surface-secondary/70"
                  >
                    <Link href="/problems">Practice coding</Link>
                  </Button>
                </div>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Focus", focusArea],
                  ["Target", targetText],
                  ["Streak", streakText],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-white/65 px-4 py-3 backdrop-blur-sm dark:bg-surface-secondary/70"
                  >
                    <p className="font-medium text-muted-foreground text-xs uppercase">
                      {label}
                    </p>
                    <p className="mt-1 font-semibold text-foreground text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden border-border border-t bg-surface-product/70 p-6 sm:p-8 lg:border-t-0 lg:border-l dark:bg-surface-secondary/55">
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Readiness pulse
                    </p>
                    <p className="mt-2 text-muted-foreground text-sm leading-6">
                      Run one mock interview, then review weak signals before
                      your next coding block.
                    </p>
                  </div>
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                    Live
                  </div>
                </div>

                <div className="grid gap-4">
                  <div
                    className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-primary/20 bg-card/65"
                    style={{
                      backgroundImage: `conic-gradient(from 180deg, rgb(16 185 129 / 0.22) 0deg, rgb(16 185 129 / 0.22) ${angle}deg, transparent ${angle}deg)`,
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-border bg-background/90 text-center shadow-inner">
                      <span className="font-bold text-3xl text-foreground">
                        {readinessScore}%
                      </span>
                      <span className="text-muted-foreground text-xs">
                        ready
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {[
                      ["Score", `${Math.round(avgScore)}%`],
                      ["Practice", practiceTimeText],
                      ["Solved", String(stats?.problemsSolved ?? 0)],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-border bg-card/70 p-3 text-center"
                      >
                        <p className="text-muted-foreground text-xs">{label}</p>
                        <p className="mt-1 font-bold text-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border bg-card/70 p-4">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Next best move
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {nextBestMove}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <StatsCards />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <RecentInterviews />
              <WeeklyGoals />
            </div>

            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <QuickActions />
              <SkillsOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
