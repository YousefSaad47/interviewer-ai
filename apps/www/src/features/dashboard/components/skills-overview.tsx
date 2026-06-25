"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
} from "@/shared/ui";

import { useDashboardSkills } from "../hooks";

export function SkillsOverview() {
  const { data, isLoading } = useDashboardSkills();
  const categories = data?.categories ?? [];

  if (isLoading) {
    return (
      <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="font-bold text-foreground text-xl">
            Skills Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={`skill-skeleton-${i}`}
              className="h-24 w-full rounded-lg"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="font-bold text-foreground text-xl">
            Skills Overview
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Complete interviews to see your skills breakdown by category.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b">
        <CardTitle className="font-bold text-foreground text-xl">
          Skills Overview
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Category strength from completed interviews
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 p-4">
        {categories.map((skill) => (
          <div
            key={skill.name}
            className="rounded-lg border border-border bg-white/55 p-4 dark:bg-surface-secondary/55"
          >
            <div className="text-muted-foreground text-sm capitalize">
              {skill.name.replace("_", " ")}
            </div>
            <div className="mt-2 font-bold text-2xl text-foreground">
              {skill.avgScore}%
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Progress
                value={skill.avgScore}
                className="h-2 flex-1 bg-surface-strong dark:bg-surface-elevated [&>div]:bg-primary"
              />
              <span className="text-muted-foreground text-xs">
                {skill.count}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
