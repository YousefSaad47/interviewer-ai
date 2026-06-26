"use client";

import { useState } from "react";

import {
  AlertCircle,
  BookOpen,
  Building2,
  Crown,
  Lightbulb,
  Sparkles,
  Tag,
} from "lucide-react";

import { Badge, ScrollArea } from "@/shared/ui";

import { ExampleCase } from "./example-case";
import { getProblemMetadata } from "./problem-metadata";

interface ProblemPanelProps {
  problem: {
    id: string;
    slug?: string;
    title: string;
    description: string;
    difficulty: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
  };
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const metadata = getProblemMetadata(problem.slug, problem.title);
  const [showHint, setShowHint] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>(
    {},
  );

  const toggleHint = (index: number) => {
    setRevealedHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getHintButtonText = (index: number, isRevealed: boolean) => {
    const ordinals = ["Hint 1", "Second Hint", "Third Hint"];
    const label = ordinals[index] || `Hint ${index + 1}`;
    return isRevealed ? `Hide ${label}` : `Show ${label}`;
  };

  // Helper to format inline code pills dynamically in the description text
  function formatDescription(description: string) {
    if (!description) return null;

    // Matches backticks or specific keywords like target, nums, indices, complexity notations, etc.
    const regex =
      /(`[^`]+`|'[^']+'|\b(?:nums(?:\[i\]|\[\d+\]|\.length)?|target|indices|dp\[i\]|wordDict|nums1|nums2|nums1\[i\]|nums2\[i\]|sentence|F\(n(?:-\d)?\)|F\(0\)|F\(1\)|O\(1\)|O\(n\)|O\(n²\)|O\(n\slog\sn\)|O\(log\(min\(n,m\)\)\)|O\(2\^N\)|capacity|key|value)\b)/g;

    const parts = description.split(regex);
    return parts.map((part, index) => {
      const isCode =
        (part.startsWith("`") && part.endsWith("`")) ||
        (part.startsWith("'") && part.endsWith("'")) ||
        /^(nums|target|indices|dp\[|wordDict|nums1|nums2|sentence|F\(|O\(|capacity|key|value)/.test(
          part,
        );

      if (isCode) {
        const cleanText = part.replace(/^[`']|[`']$/g, "");
        return (
          <code
            key={`code-${index}`}
            className="relative mx-0.5 rounded border border-border-subtle bg-muted/65 px-[0.35rem] py-[0.15rem] font-mono font-semibold text-[13px] text-foreground transition-colors hover:bg-muted/90 dark:bg-surface-secondary/60"
          >
            {cleanText}
          </code>
        );
      }
      return part;
    });
  }

  return (
    <div className="flex h-full flex-col bg-background/30 px-4 pt-6 sm:px-6 sm:pt-8 md:px-8 md:pt-10 lg:px-10 lg:pt-10">
      <ScrollArea className="flex-1 pr-1.5">
        <div className="mx-auto w-full max-w-3xl space-y-8 pb-16">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-bold text-2xl text-heading tracking-tight sm:text-3xl">
                {metadata.number}. {problem.title}
              </h1>
            </div>

            {/* Badges and Buttons Group */}
            <div className="flex flex-wrap items-center gap-2 border-border/25 border-b pb-4">
              {/* Difficulty Badge */}
              <Badge
                className={`rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wider ${
                  problem.difficulty === "EASY"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : problem.difficulty === "MEDIUM"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                }`}
              >
                {problem.difficulty.toLowerCase()}
              </Badge>

              {/* Premium Badge */}
              {metadata.isPremium && (
                <Badge className="flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-700 text-xs dark:bg-amber-500/15 dark:text-amber-400">
                  <Crown className="size-3 text-amber-500" />
                  Premium
                </Badge>
              )}

              {/* Hint Button */}
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-xs shadow-sm transition-all duration-150 active:scale-95 ${
                  showHint
                    ? "border-yellow-500/40 bg-yellow-500/20 text-yellow-800 dark:border-yellow-500/35 dark:bg-yellow-500/25 dark:text-yellow-300"
                    : "border-yellow-500/15 bg-yellow-500/5 text-yellow-700 hover:bg-yellow-500/12 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400"
                }`}
              >
                <Lightbulb
                  className={`size-3.5 ${showHint ? "fill-yellow-500 text-yellow-500" : ""}`}
                />
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </div>

            {/* Tags Group (Topics and Companies) */}
            <div className="flex flex-col gap-2.5 pt-1 text-xs">
              {metadata.topics.length > 0 && (
                <div className="flex flex-wrap items-start gap-1.5">
                  <span className="mt-1 flex min-w-[80px] shrink-0 items-center gap-1 font-semibold text-muted-foreground">
                    <Tag className="size-3 text-muted-foreground/85" /> Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="cursor-default rounded-full border border-sky-500/20 bg-sky-500/5 px-2.5 py-0.5 text-sky-700 transition-all duration-200 hover:border-sky-500/30 hover:bg-sky-500/10 dark:border-sky-400/15 dark:bg-sky-400/5 dark:text-sky-400 dark:hover:bg-sky-400/10"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {metadata.companies.length > 0 && (
                <div className="flex flex-wrap items-start gap-1.5">
                  <span className="mt-1 flex min-w-[80px] shrink-0 items-center gap-1 font-semibold text-muted-foreground">
                    <Building2 className="size-3 text-muted-foreground/85" />{" "}
                    Companies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.companies.map((company) => (
                      <Badge
                        key={company}
                        variant="outline"
                        className="cursor-default rounded-full border border-purple-500/20 bg-purple-500/5 px-2.5 py-0.5 text-purple-700 transition-all duration-200 hover:border-purple-500/30 hover:bg-purple-500/10 dark:border-purple-400/15 dark:bg-purple-400/5 dark:text-purple-400 dark:hover:bg-purple-400/10"
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hint panel */}
          {showHint && (
            <div className="fade-in slide-in-from-top-2 animate-in space-y-4 rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-4 shadow-[0_4px_25px_rgba(234,179,8,0.07)] transition-all duration-300 sm:p-5 dark:bg-yellow-500/5">
              <div className="flex items-center gap-2 border-yellow-500/10 border-b pb-2">
                <Sparkles className="size-4 text-yellow-600 dark:text-yellow-400" />
                <h5 className="font-semibold text-xs text-yellow-800 uppercase tracking-wider sm:text-sm dark:text-yellow-300">
                  Incremental Hints ({metadata.hints.length})
                </h5>
              </div>

              <div className="space-y-3">
                {metadata.hints.map((hintText, index) => {
                  const isRevealed = !!revealedHints[index];
                  const label =
                    index === 0
                      ? "Hint 1"
                      : index === 1
                        ? "Second Hint"
                        : "Third Hint";
                  return (
                    <div
                      key={`hint-${index}`}
                      className="space-y-2 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-3 dark:bg-yellow-950/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-yellow-800/80 dark:text-yellow-400/85">
                          {label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleHint(index)}
                          className="cursor-pointer rounded border border-yellow-500/25 bg-yellow-500/10 px-2 py-0.5 font-medium text-[10px] text-yellow-850 transition-all duration-150 hover:bg-yellow-500/20 active:scale-95 dark:border-yellow-500/30 dark:text-yellow-300"
                        >
                          {getHintButtonText(index, isRevealed)}
                        </button>
                      </div>
                      {isRevealed && (
                        <p className="border-yellow-500/5 border-t pt-1 font-sans text-xs text-yellow-950/80 leading-relaxed sm:text-sm dark:text-yellow-200/80">
                          {hintText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Problem Description */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-base text-heading tracking-tight sm:text-lg">
              <BookOpen className="size-4 text-primary" />
              Description
            </h3>
            <div className="space-y-4 whitespace-pre-wrap font-sans text-paragraph text-sm leading-relaxed tracking-normal sm:text-base">
              {formatDescription(problem.description)}
            </div>
          </section>

          {/* Examples */}
          <section className="space-y-4">
            <h3 className="font-semibold text-base text-heading tracking-tight sm:text-lg">
              Examples
            </h3>
            <div className="space-y-5">
              {problem.examples.map((example, index) => (
                <ExampleCase
                  key={`example-${index}`}
                  number={index + 1}
                  input={example.input}
                  output={example.output}
                  explanation={example.explanation}
                />
              ))}
            </div>
          </section>

          {/* Constraints */}
          {metadata.constraints && metadata.constraints.length > 0 && (
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-base text-heading tracking-tight sm:text-lg">
                <AlertCircle className="size-4.5 text-muted-foreground" />
                Constraints
              </h3>
              <div className="flex flex-col gap-2 pt-1">
                {metadata.constraints.map((constraint) => (
                  <div
                    key={constraint}
                    className="flex w-fit cursor-default items-center gap-2 rounded-lg border border-border/30 bg-muted/40 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/25 hover:text-foreground sm:text-xs dark:bg-surface-secondary/40"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/45" />
                    {constraint}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
