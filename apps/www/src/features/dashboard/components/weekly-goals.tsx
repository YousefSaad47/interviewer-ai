"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDashboardGoals } from "../hooks";
import { getGoalProgress } from "../utils";

export function WeeklyGoals() {
  const { data, isLoading } = useDashboardGoals();

  if (isLoading) {
    return (
      <Card className="rounded-[15px] border-border bg-card dark:bg-card">
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
      progress: getGoalProgress(
        data?.interviewsDone ?? 0,
        data?.interviewGoal ?? 3,
      ),
      done: data?.interviewsDone ?? 0,
      target: data?.interviewGoal ?? 3,
    },
    {
      title: "Solve coding problems",
      progress: getGoalProgress(
        data?.problemsDone ?? 0,
        data?.problemGoal ?? 5,
      ),
      done: data?.problemsDone ?? 0,
      target: data?.problemGoal ?? 5,
    },
  ];

  return (
    <Card className="rounded-[15px] border-border bg-card dark:bg-card">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Your Goals This Week
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.title} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground">{goal.title}</span>
              <span className="text-muted-foreground text-sm">
                {goal.done} / {goal.target}
              </span>
            </div>
            <Progress
              value={goal.progress}
              className="h-2 bg-surface-strong dark:bg-surface-secondary [&>div]:bg-primary"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
