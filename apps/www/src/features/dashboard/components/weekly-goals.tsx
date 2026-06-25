"use client";

import { Code2, Target, Video } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
} from "@/shared/ui";

import { useDashboardGoals } from "../hooks";
import { getGoalProgress } from "../utils";

export function WeeklyGoals() {
  const { data, isLoading } = useDashboardGoals();

  if (isLoading) {
    return (
      <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="font-bold text-foreground text-xl">
            Your Goals This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={`goal-skeleton-${i}`}
              className="h-8 w-full rounded"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const goals = [
    {
      title: "Complete mock interviews",
      description: "Rehearse pressure, structure, and delivery.",
      icon: Video,
      progress: getGoalProgress(
        data?.interviewsDone ?? 0,
        data?.interviewGoal ?? 3,
      ),
      done: data?.interviewsDone ?? 0,
      target: data?.interviewGoal ?? 3,
    },
    {
      title: "Solve coding problems",
      description: "Sharpen speed with focused problem reps.",
      icon: Code2,
      progress: getGoalProgress(
        data?.problemsDone ?? 0,
        data?.problemGoal ?? 5,
      ),
      done: data?.problemsDone ?? 0,
      target: data?.problemGoal ?? 5,
    },
  ];
  const weeklyProgress = Math.round(
    goals.reduce((total, goal) => total + goal.progress, 0) / goals.length,
  );

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="relative border-border border-b">
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Target className="h-4 w-4" />
              <span className="font-semibold text-xs uppercase">
                Weekly sprint
              </span>
            </div>
            <CardTitle className="font-bold text-foreground text-xl">
              Your Goals This Week
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Keep the week measurable and lightweight
            </p>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-right">
            <p className="font-bold text-2xl text-foreground">
              {weeklyProgress}%
            </p>
            <p className="text-muted-foreground text-xs">overall</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 p-5 md:grid-cols-2">
        {goals.map((goal) => (
          <div
            key={goal.title}
            className="group relative overflow-hidden rounded-lg border border-border bg-white/60 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/85 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:bg-surface-secondary/55 dark:hover:bg-surface-secondary"
          >
            <div className="absolute right-0 bottom-0 h-20 w-20 translate-x-6 translate-y-8 rounded-full bg-primary/10 blur-2xl transition-transform group-hover:scale-125" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                  <goal.icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-base text-foreground">
                    {goal.title}
                  </span>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {goal.description}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-card/80 px-2.5 py-1 font-semibold text-foreground text-xs">
                {goal.done}/{goal.target}
              </span>
            </div>

            <div className="relative mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Progress</span>
                <span className="font-semibold text-primary text-xs">
                  {goal.progress}%
                </span>
              </div>
              <Progress
                value={goal.progress}
                className="h-2.5 bg-surface-strong dark:bg-surface-elevated [&>div]:bg-primary"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
