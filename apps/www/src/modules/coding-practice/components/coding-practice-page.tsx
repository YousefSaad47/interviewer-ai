"use client";

import { useState } from "react";

import { Header } from "@/modules/landing/components";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";

import { CodePanel } from "./code-panel";
import { ProblemPanel } from "./problem-panel";

export function CodingPracticePage() {
  const [showProblem, setShowProblem] = useState(true);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Header />
      {/* Background mesh pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.39] dark:opacity-[0.2]"
        style={{
          backgroundImage: "url('/mesh.svg')",
          backgroundSize: "cover",
        }}
      />

      {/* Main Content */}
      <div className="relative h-[calc(100%-4rem)] pt-16 md:h-[calc(100%-5rem)] md:pt-20">
        {/* Mobile: Stacked Layout */}
        <div className="flex h-full flex-col lg:hidden">
          {/* Toggle Button - Mobile Only */}
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
              <ProblemPanel />
            </div>
          ) : (
            <div className="flex-1">
              <CodePanel />
            </div>
          )}
        </div>

        {/* Desktop: Resizable Layout */}
        <div className="hidden h-full lg:block">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            {/* Problem Panel */}
            <ResizablePanel defaultSize="50%" minSize="20%" maxSize="80%">
              <div className="h-full overflow-auto">
                <ProblemPanel />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Code Panel */}
            <ResizablePanel defaultSize="50%" minSize="20%" maxSize="80%">
              <CodePanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
