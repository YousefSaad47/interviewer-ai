"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Header } from "@/modules/landing/components";
import { useProblemsInfinite } from "@/modules/problem/hooks/use-problems-infinite";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProblemsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { problems, isLoading, isFetchingNextPage, hasNextPage, sentinelRef } =
    useProblemsInfinite(
      difficulty !== "all" ? difficulty : undefined,
      debouncedSearch || undefined,
    );

  return (
    <div className="relative min-h-screen w-full bg-background">
      <Header />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:pt-32">
        <div className="mb-8 flex flex-col gap-2 md:mb-12">
          <h1 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl md:text-4xl">
            Coding Problems
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Practice with our collection of coding challenges
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 flex-1"
          />
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="h-10 w-full sm:w-40">
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          {(difficulty !== "all" || debouncedSearch) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDifficulty("all");
                setSearch("");
                setDebouncedSearch("");
              }}
              className="h-10 shrink-0"
            >
              Clear filters
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className="h-24 w-full rounded-lg"
              />
            ))}
          </div>
        )}

        {!isLoading && problems.length === 0 && (
          <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <p className="text-lg text-muted-foreground">No problems found</p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or check back later
            </p>
          </Card>
        )}

        {problems.length > 0 && (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Card
                key={problem.id}
                onClick={() => router.push(`/problems/${problem.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/problems/${problem.slug}`);
                  }
                }}
                tabIndex={0}
                role="button"
                className="cursor-pointer border-neutral-200 p-5 transition-all hover:border-neutral-300 hover:shadow-md sm:p-6 dark:border-neutral-800 dark:hover:border-neutral-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h2 className="font-semibold text-foreground text-lg sm:text-xl">
                      {problem.title}
                    </h2>
                    <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                      {problem.description}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <Badge
                        variant="outline"
                        className="rounded-md border-neutral-300 px-2 py-0.5 text-xs dark:border-neutral-700"
                      >
                        {problem.testCaseCount} test cases
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    className={
                      "shrink-0 rounded-lg px-3 py-1 font-medium text-xs" +
                      (problem.difficulty === "EASY"
                        ? "bg-green-500/10 text-green-600"
                        : problem.difficulty === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-red-500/10 text-red-600")
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel — always rendered */}
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="w-full space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={`load-more-${i}`}
                  className="h-24 w-full rounded-lg"
                />
              ))}
            </div>
          )}
          {!hasNextPage && problems.length > 5 && (
            <p className="text-muted-foreground text-sm">
              You've reached the end
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
