"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  Code2,
  Filter,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import { Header } from "@/features/landing";
import { cn } from "@/lib";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/shared/ui";

import { useProblemsInfinite } from "../hooks";

export function ProblemsPage() {
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

  const totalTestCases = problems.reduce(
    (count, problem) => count + problem.testCaseCount,
    0,
  );
  const filteredLabel =
    difficulty === "all" ? "All levels" : difficulty.toLowerCase();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Header />

      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgb(255_255_255/0.62),rgb(255_255_255/0))] dark:bg-[linear-gradient(180deg,rgb(52_211_153/0.07),rgb(8_11_15/0))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:pt-32">
        <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="space-y-5">
            <Badge
              variant="outline"
              className="h-8 rounded-lg border-primary/20 bg-card/70 px-3 font-semibold text-primary shadow-sm backdrop-blur-xl"
            >
              <Sparkles className="size-3.5" />
              Interview prep workspace
            </Badge>
            <div className="max-w-3xl space-y-3">
              <h1 className="max-w-2xl text-balance font-bold text-4xl text-heading tracking-tight sm:text-5xl lg:text-6xl">
                Coding Problems
              </h1>
              <p className="max-w-2xl text-muted-foreground text-sm leading-6 sm:text-base">
                Pick a challenge, run your solution, and build the technical
                interview rhythm with focused practice sets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border/70 bg-card/75 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="border-border/70 border-r p-4">
              <p className="text-muted-foreground text-xs">Visible</p>
              <p className="mt-1 font-semibold text-2xl text-heading">
                {problems.length}
              </p>
            </div>
            <div className="border-border/70 border-r p-4">
              <p className="text-muted-foreground text-xs">Tests</p>
              <p className="mt-1 font-semibold text-2xl text-heading">
                {totalTestCases}
              </p>
            </div>
            <div className="p-4">
              <p className="text-muted-foreground text-xs">Scope</p>
              <p className="mt-1 truncate font-semibold text-heading text-sm capitalize">
                {filteredLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-20 mb-6 rounded-lg border border-border/70 bg-card/85 p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-card/90 dark:shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_190px_auto]">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search problems"
                placeholder="Search arrays, strings, dynamic programming..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-lg border-transparent bg-white/70 pl-10 shadow-none transition-[border-color,box-shadow,background-color] focus-visible:bg-white dark:bg-surface-secondary/70 dark:focus-visible:bg-surface-secondary"
              />
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-11 rounded-lg border-transparent bg-white/70 shadow-none dark:bg-surface-secondary/70">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="All difficulties" />
                </div>
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
                className="h-11 shrink-0 rounded-lg px-4 font-semibold transition-transform active:scale-[0.98]"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className="h-32 w-full rounded-lg border border-border/40 bg-card/70"
              />
            ))}
          </div>
        )}

        {!isLoading && problems.length === 0 && (
          <Card className="items-center justify-center gap-3 rounded-lg border-border/70 bg-card/80 p-12 text-center backdrop-blur-xl">
            <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
              <Search className="size-5" />
            </div>
            <p className="font-semibold text-heading text-lg">
              No problems found
            </p>
            <p className="max-w-sm text-muted-foreground text-sm">
              Try a broader search or switch the difficulty filter.
            </p>
          </Card>
        )}

        {problems.length > 0 && (
          <div className="grid gap-3">
            {problems.map((problem) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.slug}`}
                className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="relative overflow-hidden rounded-lg border-border/70 bg-card/80 p-0 transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:bg-card group-hover:shadow-[0_22px_70px_rgba(15,23,42,0.1)] dark:group-hover:shadow-[0_26px_70px_rgba(0,0,0,0.34)]">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-teal-400 to-cyan-400 opacity-70" />
                  <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="h-7 rounded-md border-border/70 bg-white/55 px-2.5 font-semibold text-muted-foreground dark:bg-surface-secondary/70"
                        >
                          <Target className="size-3" />
                          {problem.testCaseCount} test cases
                        </Badge>
                        <Badge
                          variant="outline"
                          className="h-7 rounded-md border-border/70 bg-white/55 px-2.5 font-semibold text-muted-foreground dark:bg-surface-secondary/70"
                        >
                          <Code2 className="size-3" />
                          Practice
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-semibold text-heading text-lg tracking-tight transition-colors group-hover:text-primary sm:text-xl">
                          {problem.title}
                        </h2>
                        <p className="line-clamp-2 max-w-3xl text-muted-foreground text-sm leading-6">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <Badge
                        className={cn(
                          "h-7 rounded-md px-3 font-bold text-[11px] tracking-wide shadow-sm",
                          problem.difficulty === "EASY" &&
                            "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
                          problem.difficulty === "MEDIUM" &&
                            "bg-amber-500/14 text-amber-700 ring-1 ring-amber-500/22 dark:text-amber-300",
                          problem.difficulty === "HARD" &&
                            "bg-rose-500/12 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300",
                        )}
                      >
                        {problem.difficulty}
                      </Badge>
                      <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border/70 bg-white/55 text-muted-foreground transition-[border-color,color,transform,background-color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground dark:bg-surface-secondary/70">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel - always rendered */}
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="grid w-full gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={`load-more-${i}`}
                  className="h-32 w-full rounded-lg border border-border/40 bg-card/70"
                />
              ))}
            </div>
          )}
          {!hasNextPage && problems.length > 5 && (
            <p className="rounded-full border border-border/70 bg-card/75 px-4 py-2 text-muted-foreground text-sm shadow-sm backdrop-blur-xl">
              You've reached the end
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
