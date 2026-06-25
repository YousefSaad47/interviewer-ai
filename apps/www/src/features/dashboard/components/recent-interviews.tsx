"use client";

import { Calendar, Clock, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDashboardRecent } from "../hooks";

export function RecentInterviews() {
  const { data, isLoading } = useDashboardRecent();

  if (isLoading) {
    return (
      <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="font-bold text-foreground text-xl">
            Recent Interviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`recent-skeleton-${i}`}
              className="h-16 w-full rounded-lg"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const interviews = data?.interviews ?? [];

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-border border-b">
        <div>
          <CardTitle className="font-bold text-foreground text-xl">
            Recent Interviews
          </CardTitle>
          <p className="mt-1 text-muted-foreground text-sm">
            Latest sessions and review signals
          </p>
        </div>
        <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-xs sm:block">
          Activity feed
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {interviews.length === 0 ? (
          <div className="rounded-lg border border-border border-dashed bg-white/45 p-8 text-center dark:bg-surface-secondary/40">
            <p className="font-medium text-foreground text-sm">
              No interviews completed yet
            </p>
            <p className="mt-1 text-muted-foreground text-sm">
              Start a mock interview to build your first review trail.
            </p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              className="group flex flex-col gap-4 rounded-lg border border-transparent bg-white/65 px-4 py-4 transition-all hover:border-primary/25 hover:bg-white/90 sm:flex-row sm:items-center sm:justify-between dark:bg-surface-secondary/60 dark:hover:bg-surface-secondary"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-base text-foreground capitalize">
                    {interview.category.replace("_", " ")} Interview
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(interview.startedAt).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground text-sm capitalize">
                      {interview.difficulty.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold text-primary text-sm">
                    {interview.score != null
                      ? `${Math.round(interview.score)}%`
                      : "--"}
                  </span>
                </div>
                <span className="hidden h-px w-10 bg-primary/50 transition-all group-hover:w-14 sm:block" />
                <span className="font-bold text-lg text-primary sm:hidden">
                  {interview.score != null
                    ? `${Math.round(interview.score)}%`
                    : "--"}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
