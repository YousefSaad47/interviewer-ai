"use client";

import { BarChart3, Clock, Target, Trophy } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDashboardStats } from "../hooks";

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={`stat-skeleton-${i}`}
            className="h-24 w-full rounded-lg"
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: BarChart3,
      value: String(data?.interviewsCompleted ?? 0),
      label: "Interviews Completed",
      caption: "Mock sessions",
      tone: "text-emerald-600 dark:text-emerald-300",
    },
    {
      icon: Target,
      value: `${Math.round(data?.averageScore ?? 0)}%`,
      label: "Average Score",
      caption: "Across interviews",
      tone: "text-teal-600 dark:text-teal-300",
    },
    {
      icon: Clock,
      value: `${Math.round((data?.practiceTimeMinutes ?? 0) / 60)}h`,
      label: "Practice Time",
      caption: "Focused reps",
      tone: "text-cyan-600 dark:text-cyan-300",
    },
    {
      icon: Trophy,
      value: String(data?.problemsSolved ?? 0),
      label: "Problems Solved",
      caption: "Coding drills",
      tone: "text-lime-700 dark:text-lime-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="group overflow-hidden rounded-lg border-border bg-card/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card/95 hover:shadow-[0_16px_46px_rgba(15,23,42,0.08)] dark:bg-card/85 dark:hover:bg-card"
          >
            <CardContent className="p-3.5">
              <div className="mb-3.5 flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white/55 ${stat.tone} dark:bg-surface-secondary/70`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="h-px w-6 bg-border transition-all duration-300 group-hover:w-10 group-hover:bg-primary/40" />
              </div>
              <div>
                <p className="font-bold text-2xl text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 font-semibold text-foreground text-sm">
                  {stat.label}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  {stat.caption}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
