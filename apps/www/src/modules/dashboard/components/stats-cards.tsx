"use client";

import { useGetApiDashboardStats } from "@repo/kubb";
import { BarChart3, Clock, Target, Trophy } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function StatsCards() {
  const { data, isLoading } = useGetApiDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={`stat-skeleton-${i}`}
            className="h-28 w-full rounded-[15px]"
          />
        ))}
      </div>
    );
  }

  const d = data as
    | {
        interviewsCompleted: number;
        averageScore: number;
        practiceTimeMinutes: number;
        problemsSolved: number;
      }
    | undefined;

  const stats = [
    {
      icon: BarChart3,
      value: String(d?.interviewsCompleted ?? 0),
      label: "Interviews Completed",
    },
    {
      icon: Target,
      value: `${Math.round(d?.averageScore ?? 0)}%`,
      label: "Average Score",
    },
    {
      icon: Clock,
      value: `${Math.round((d?.practiceTimeMinutes ?? 0) / 60)}h`,
      label: "Practice Time",
    },
    {
      icon: Trophy,
      value: String(d?.problemsSolved ?? 0),
      label: "Problems Solved",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900"
          >
            <CardContent className="flex items-center justify-between">
              <Icon className="h-9 w-9 text-primary" />
              <span className="font-bold text-3xl text-foreground">
                {stat.value}
              </span>
            </CardContent>
            <CardContent className="text-muted-foreground text-sm">
              {stat.label}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
