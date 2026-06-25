"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface TestResult {
  passed: boolean;
  output: string | null;
  error: string | null;
}

interface SubmissionDisplay {
  status: string;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  results: TestResult[];
  errorMessage?: string | null;
}

interface TestCaseViewProps {
  lastSubmission: SubmissionDisplay | null;
  runResult: {
    output: string | null;
    error: string | null;
    time: string | null;
    memory: number | null;
  } | null;
  isPending: boolean;
  isRunning: boolean;
}

export function TestCaseView({
  lastSubmission,
  runResult,
  isPending,
  isRunning,
}: TestCaseViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b px-4 py-2.5 md:px-5 md:py-3">
        <span className="font-medium text-muted-foreground text-xs md:text-sm">
          Test Results
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 md:space-y-4 md:p-5">
        {isRunning && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running code...
          </div>
        )}

        {isPending && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running tests...
          </div>
        )}

        {!isRunning && !isPending && !lastSubmission && runResult && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card/75 p-3 md:p-4 dark:bg-surface-secondary">
              {runResult.output && (
                <div className="space-y-1">
                  <span className="block text-muted-foreground text-xs">
                    Output:
                  </span>
                  <pre className="overflow-x-auto rounded bg-muted/70 p-2 font-mono text-xs dark:bg-surface-elevated">
                    {runResult.output}
                  </pre>
                </div>
              )}
              {runResult.error && (
                <div className="mt-2 space-y-1">
                  <span className="block text-red-500 text-xs">Error:</span>
                  <pre className="overflow-x-auto rounded bg-muted/70 p-2 font-mono text-red-400 text-xs dark:bg-surface-elevated">
                    {runResult.error}
                  </pre>
                </div>
              )}
              {(runResult.time != null || runResult.memory != null) && (
                <p className="mt-2 text-muted-foreground text-xs">
                  {runResult.time != null
                    ? `${Number.parseFloat(runResult.time) * 1000}ms`
                    : ""}
                  {runResult.time != null && runResult.memory != null
                    ? " · "
                    : ""}
                  {runResult.memory != null ? `${runResult.memory} KB` : ""}
                </p>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Submit your code to run against all test cases.
            </p>
          </div>
        )}

        {!isRunning && !isPending && !lastSubmission && !runResult && (
          <p className="text-muted-foreground text-sm">
            Run or submit your code to see results.
          </p>
        )}

        {!isPending && lastSubmission && (
          <>
            {/* Status Bar */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/70 p-3 md:p-4 dark:bg-surface-secondary">
              {lastSubmission.status === "ACCEPTED" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-semibold text-sm">
                  {lastSubmission.errorMessage ?? lastSubmission.status}
                </p>
                <p className="text-muted-foreground text-xs">
                  {lastSubmission.errorMessage
                    ? ""
                    : lastSubmission.executionTimeMs != null &&
                        lastSubmission.memoryUsedKb != null
                      ? `${lastSubmission.executionTimeMs}ms · ${lastSubmission.memoryUsedKb} KB`
                      : "—"}
                </p>
              </div>
            </div>

            {/* Per Test Case Results */}
            <div className="space-y-2">
              {lastSubmission.results.map((result, index) => (
                <div
                  key={`result-${index}`}
                  className="rounded-lg border border-border bg-card/75 p-3 md:p-4 dark:bg-surface-secondary"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium text-sm">
                      Test Case {index + 1}
                    </span>
                  </div>
                  {result.output && (
                    <div className="space-y-1">
                      <span className="block text-muted-foreground text-xs">
                        Output:
                      </span>
                      <pre className="overflow-x-auto rounded bg-muted/70 p-2 font-mono text-xs dark:bg-surface-elevated">
                        {result.output}
                      </pre>
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-2 space-y-1">
                      <span className="block text-red-500 text-xs">Error:</span>
                      <pre className="overflow-x-auto rounded bg-muted/70 p-2 font-mono text-red-400 text-xs dark:bg-surface-elevated">
                        {result.error}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
