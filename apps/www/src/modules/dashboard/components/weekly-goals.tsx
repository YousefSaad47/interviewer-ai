"use client";

import { useGetApiDashboardGoals } from "@repo/kubb";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function WeeklyGoals() {
  const { data, isLoading } = useGetApiDashboardGoals();

  if (isLoading) {
    return (
      <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
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

  const d = data as
    | {
        interviewGoal: number;
        interviewsDone: number;
        problemGoal: number;
        problemsDone: number;
      }
    | undefined;

  const goals = [
    {
      title: "Complete mock interviews",
      progress: d ? Math.round((d.interviewsDone / d.interviewGoal) * 100) : 0,
      done: d?.interviewsDone ?? 0,
      target: d?.interviewGoal ?? 3,
    },
    {
      title: "Solve coding problems",
      progress: d ? Math.round((d.problemsDone / d.problemGoal) * 100) : 0,
      done: d?.problemsDone ?? 0,
      target: d?.problemGoal ?? 5,
    },
  ];

  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
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
              className="h-2 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-primary"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
