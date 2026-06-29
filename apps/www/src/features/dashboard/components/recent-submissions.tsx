"use client";

import { Code2, Cpu } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui";

import { useDashboardRecent } from "../hooks";

const statusColors: Record<string, string> = {
  ACCEPTED: "text-emerald-600 dark:text-emerald-400",
  WRONG_ANSWER: "text-red-600 dark:text-red-400",
  TIME_LIMIT_EXCEEDED: "text-orange-600 dark:text-orange-400",
  COMPILE_ERROR: "text-rose-600 dark:text-rose-400",
  RUNTIME_ERROR: "text-red-600 dark:text-red-400",
  PENDING: "text-yellow-600 dark:text-yellow-400",
};

export function RecentSubmissions() {
  const { data, isLoading } = useDashboardRecent();

  if (isLoading) {
    return (
      <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="font-bold text-foreground text-xl">
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`sub-skeleton-${i}`}
              className="h-16 w-full rounded-lg"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const submissions = data?.submissions ?? [];

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-border border-b">
        <div>
          <CardTitle className="font-bold text-foreground text-xl">
            Recent Submissions
          </CardTitle>
          <p className="mt-1 text-muted-foreground text-sm">
            Latest coding practice results
          </p>
        </div>
        <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-xs sm:block">
          Code log
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {submissions.length === 0 ? (
          <div className="rounded-lg border border-border border-dashed bg-white/45 p-8 text-center dark:bg-surface-secondary/40">
            <p className="font-medium text-foreground text-sm">
              No submissions yet
            </p>
            <p className="mt-1 text-muted-foreground text-sm">
              Solve a coding problem to track your progress here.
            </p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className="group flex flex-col gap-4 rounded-lg border border-transparent bg-white/65 px-4 py-4 transition-all hover:border-primary/25 hover:bg-white/90 sm:flex-row sm:items-center sm:justify-between dark:bg-surface-secondary/60 dark:hover:bg-surface-secondary"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 p-3">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-base text-foreground">
                    {submission.problemTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Cpu className="h-3.5 w-3.5" />
                      {submission.language}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5">
                  <span
                    className={`font-bold text-sm ${
                      statusColors[submission.status] ?? "text-muted-foreground"
                    }`}
                  >
                    {submission.status.replace(/_/g, " ")}
                  </span>
                </div>
                {submission.executionTimeMs != null && (
                  <span className="text-muted-foreground text-xs">
                    {submission.executionTimeMs}ms
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
