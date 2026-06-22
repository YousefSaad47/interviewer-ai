"use client";

import dynamic from "next/dynamic";

import { Play, RotateCcw, Send } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";

import { useCodeWorkspace } from "../hooks";
import { TestCaseView } from "./test-case-view";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

interface CodePanelProps {
  problemId: string;
}

export function CodePanel({ problemId }: CodePanelProps) {
  const { theme } = useTheme();
  const {
    code,
    handleLanguageChange,
    handleReset,
    handleRun,
    handleSubmit,
    isPending,
    isPolling,
    isRunning,
    language,
    lastSubmission,
    runResult,
    setCode,
  } = useCodeWorkspace(problemId);

  return (
    <ResizablePanelGroup orientation="vertical" className="h-full">
      <ResizablePanel defaultSize="60%" minSize="30%" maxSize="80%">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b bg-background px-4 py-3 md:px-6 md:py-3.5 dark:border-[#1a1a1a]">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-35 border-none bg-muted font-medium text-xs md:w-40 md:text-sm">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground text-xs hover:text-foreground md:text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Code
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={language}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                padding: { top: 16, bottom: 16 },
                fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                fontLigatures: true,
              }}
            />
          </div>

          <div className="flex justify-end gap-2 border-t bg-background px-4 py-3 md:gap-3 md:px-6 md:py-3.5 dark:border-[#1a1a1a]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={isRunning || isPending || isPolling}
              className="gap-2 text-xs md:text-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending || isPolling || isRunning}
              className="gap-2 bg-primary text-xs hover:bg-primary/90 md:text-sm"
            >
              <Send className="h-4 w-4" />
              {isPending || isPolling ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize="40%" minSize="20%" maxSize="70%">
        <TestCaseView
          lastSubmission={lastSubmission}
          runResult={runResult}
          isPending={isPending || isPolling}
          isRunning={isRunning}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
