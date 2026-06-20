"use client";

import { useState } from "react";

import { Header } from "@/modules/landing/components";
import { useProblem } from "@/modules/problem/hooks/use-problem";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { CodePanel } from "./code-panel";
import { ProblemPanel } from "./problem-panel";

interface CodingPracticePageProps {
  slug: string | null;
}

export function CodingPracticePage({ slug }: CodingPracticePageProps) {
  const [showProblem, setShowProblem] = useState(true);
  const { data: problem, isLoading } = useProblem(slug);

  if (!slug) {
    return (
      <div className="relative h-screen w-full bg-background">
        <Header />
        <div className="flex h-[calc(100%-4rem)] items-center justify-center pt-16">
          <p className="text-lg text-muted-foreground">
            Select a problem from the{" "}
            <a href="/problems" className="text-primary underline">
              problems page
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative h-screen w-full bg-background">
        <Header />
        <div className="flex h-[calc(100%-4rem)] items-center justify-center pt-16">
          <Skeleton className="h-96 w-full max-w-4xl rounded-lg" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="relative h-screen w-full bg-background">
        <Header />
        <div className="flex h-[calc(100%-4rem)] items-center justify-center pt-16">
          <p className="text-lg text-muted-foreground">Problem not found</p>
        </div>
      </div>
    );
  }

  const problemData = {
    id: problem.id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    examples: Array.isArray(problem.examples)
      ? (problem.examples as Array<{
          input: string;
          output: string;
          explanation: string;
        }>)
      : [],
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Header />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.39] dark:opacity-[0.2]"
        style={{
          backgroundImage: "url('/mesh.svg')",
          backgroundSize: "cover",
        }}
      />

      <div className="relative h-[calc(100%-4rem)] pt-16 md:h-[calc(100%-5rem)] md:pt-20">
        <div className="flex h-full flex-col lg:hidden">
          <div className="border-b p-2">
            <button
              type="button"
              onClick={() => setShowProblem(!showProblem)}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
            >
              {showProblem ? "Show Code Editor" : "Show Problem"}
            </button>
          </div>

          {showProblem ? (
            <div className="flex-1 overflow-auto">
              <ProblemPanel problem={problemData} />
            </div>
          ) : (
            <div className="flex-1">
              <CodePanel problemId={problem.id} />
            </div>
          )}
        </div>

        <div className="hidden h-full lg:block">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="50%" minSize="20%" maxSize="80%">
              <div className="h-full overflow-auto">
                <ProblemPanel problem={problemData} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="50%" minSize="20%" maxSize="80%">
              <CodePanel problemId={problem.id} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
