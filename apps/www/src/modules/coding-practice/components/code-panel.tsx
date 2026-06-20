"use client";

import { useEffect, useRef, useState } from "react";

import Editor from "@monaco-editor/react";
import {
  type CodingSubmitResponse,
  usePostApiCodingSubmissions,
} from "@repo/kubb";
import { Play, RotateCcw, Send } from "lucide-react";
import { useTheme } from "next-themes";

import {
  LANGUAGE_STARTER_CODE,
  type Language,
} from "@/modules/coding-practice/constants";
import { Button } from "@/shared/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { TestCaseView } from "./test-case-view";

interface SubmissionResult {
  passed: boolean;
  output: string | null;
  error: string | null;
}

interface CodePanelProps {
  problemId: string;
}

export function CodePanel({ problemId }: CodePanelProps) {
  const { theme } = useTheme();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState<string>(
    LANGUAGE_STARTER_CODE.javascript ?? "",
  );
  const [lastSubmission, setLastSubmission] = useState<{
    status: string;
    executionTimeMs: number | null;
    memoryUsedKb: number | null;
    results: Array<{
      passed: boolean;
      output: string | null;
      error: string | null;
    }>;
  } | null>(null);

  const [runResult, setRunResult] = useState<{
    output: string | null;
    error: string | null;
    time: string | null;
    memory: number | null;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: submitCode, isPending } = usePostApiCodingSubmissions();

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_STARTER_CODE[newLanguage as Language] || "");
  };

  const handleReset = () => {
    setCode(LANGUAGE_STARTER_CODE[language as Language] || "");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/coding/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        setRunResult({
          output: null,
          error: errorBody?.message ?? `Request failed (${res.status})`,
          time: null,
          memory: null,
        });
        return;
      }

      const responseData = await res.json();
      const data =
        responseData !== null &&
        typeof responseData === "object" &&
        "message" in responseData &&
        "data" in responseData
          ? responseData.data
          : responseData;
      setRunResult({
        output: data?.stdout ?? null,
        error: data?.stderr || data?.compileOutput || null,
        time: data?.time ?? null,
        memory: data?.memory ?? null,
      });
    } catch {
      setRunResult({
        output: null,
        error: "Failed to run code",
        time: null,
        memory: null,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    setIsPolling(true);
    setLastSubmission(null);

    submitCode(
      {
        data: { problemId, code, language },
      },
      {
        onSuccess: (initialData: CodingSubmitResponse) => {
          if (initialData?.status !== "PENDING") {
            setIsPolling(false);
            setLastSubmission({
              status: initialData?.status ?? "ERROR",
              executionTimeMs: null,
              memoryUsedKb: null,
              results: [],
            });
            return;
          }

          const submissionId = initialData.id;

          const pollSubmission = async () => {
            try {
              const res = await fetch(
                `/api/coding/submissions/${submissionId}`,
                { credentials: "include" },
              );

              if (!res.ok) {
                console.error(`Polling failed with status ${res.status}`);
                setIsPolling(false);
                setLastSubmission({
                  status: "ERROR",
                  executionTimeMs: null,
                  memoryUsedKb: null,
                  results: [],
                });
                return;
              }

              const responseData = await res.json();
              const data =
                responseData !== null &&
                typeof responseData === "object" &&
                "message" in responseData &&
                "data" in responseData
                  ? responseData.data
                  : responseData;

              if (data && data.status !== "PENDING") {
                setIsPolling(false);
                setLastSubmission({
                  status: data.status ?? "ERROR",
                  executionTimeMs: data.executionTimeMs ?? null,
                  memoryUsedKb: data.memoryUsedKb ?? null,
                  results: (data.results ?? []).map((r: SubmissionResult) => ({
                    passed: r.passed,
                    output: r.output,
                    error: r.error,
                  })),
                });
                return;
              }
            } catch (err) {
              console.error("Polling error", err);
              setIsPolling(false);
              setLastSubmission({
                status: "ERROR",
                executionTimeMs: null,
                memoryUsedKb: null,
                results: [],
              });
              return;
            }

            pollingRef.current = setTimeout(pollSubmission, 1500);
          };

          pollingRef.current = setTimeout(pollSubmission, 1500);
        },
        onError: () => {
          setIsPolling(false);
          setLastSubmission({
            status: "ERROR",
            executionTimeMs: null,
            memoryUsedKb: null,
            results: [],
          });
        },
      },
    );
  };

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
              value={code as string}
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
