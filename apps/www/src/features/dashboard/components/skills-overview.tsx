"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDashboardSkills } from "../hooks";

export function SkillsOverview() {
  const { data, isLoading } = useDashboardSkills();
  const categories = data?.categories ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-xl">Skills Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={`skill-skeleton-${i}`}
              className="h-28 w-full rounded-[15px]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-xl">Skills Overview</h2>
        <p className="text-muted-foreground text-sm">
          Complete interviews to see your skills breakdown by category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-foreground text-xl">Skills Overview</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {categories.map((skill) => (
          <Card
            key={skill.name}
            className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900"
          >
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">
                {skill.name.replace("_", " ")}
              </div>
              <div className="font-bold text-3xl text-foreground">
                {skill.avgScore}%
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={skill.avgScore}
                  className="h-2 flex-1 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-primary"
                />
                <span className="text-muted-foreground text-xs">
                  {skill.count}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
