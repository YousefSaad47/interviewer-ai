"use client";

import { useGetApiDashboardRecent } from "@repo/kubb";
import { Calendar, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function RecentInterviews() {
  const { data, isLoading } = useGetApiDashboardRecent();

  if (isLoading) {
    return (
      <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
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

  const interviews =
    (
      data as
        | {
            interviews: Array<{
              id: string;
              category: string;
              difficulty: string;
              status: string;
              score: number | null;
              completedAt: string | null;
              startedAt: string;
            }>;
          }
        | undefined
    )?.interviews ?? [];

  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Recent Interviews
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {interviews.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground text-sm">
            No interviews completed yet. Start your first mock interview!
          </p>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex flex-col gap-3 rounded-lg bg-neutral-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-base text-foreground">
                    {interview.category.replace("_", " ")} Interview
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      {new Date(interview.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:space-y-1">
                <span className="font-bold text-lg text-primary">
                  {interview.score != null
                    ? `${Math.round(interview.score)}%`
                    : "—"}
                </span>
                <span className="text-muted-foreground text-sm capitalize">
                  {interview.difficulty.toLowerCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
