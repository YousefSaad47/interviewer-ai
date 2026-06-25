"use client";

import { useEffect, useRef, useState } from "react";

import {
  type CodingSubmitResponse,
  usePostApiCodingSubmissions,
} from "@repo/kubb";

import { getCodingSubmission, runCode } from "../api";
import type {
  Language,
  LastSubmission,
  RunResult,
  SubmissionResult,
} from "../types";
import { LANGUAGE_STARTER_CODE } from "../utils/language-starter-code";

const ERROR_SUBMISSION: LastSubmission = {
  status: "ERROR",
  executionTimeMs: null,
  memoryUsedKb: null,
  results: [],
};

const isLanguage = (value: string): value is Language => {
  return value in LANGUAGE_STARTER_CODE;
};

const mapSubmission = (data: {
  status?: string;
  executionTimeMs?: number | null;
  memoryUsedKb?: number | null;
  results?: SubmissionResult[];
}): LastSubmission => ({
  status: data.status ?? "ERROR",
  executionTimeMs: data.executionTimeMs ?? null,
  memoryUsedKb: data.memoryUsedKb ?? null,
  results: (data.results ?? []).map((result) => ({
    passed: result.passed,
    output: result.output,
    error: result.error,
  })),
});

export function useCodeWorkspace(problemId: string) {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState<string>(LANGUAGE_STARTER_CODE.javascript);
  const [lastSubmission, setLastSubmission] = useState<LastSubmission | null>(
    null,
  );
  const [runResult, setRunResult] = useState<RunResult | null>(null);
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
    if (!isLanguage(newLanguage)) return;
    setLanguage(newLanguage);
    setCode(LANGUAGE_STARTER_CODE[newLanguage]);
  };

  const handleReset = () => {
    setCode(LANGUAGE_STARTER_CODE[language]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      const result = await runCode({ code, language });
      setRunResult({
        output: result.stdout ?? null,
        error: result.stderr || result.compileOutput || null,
        time: result.time ?? null,
        memory: result.memory ?? null,
      });
    } catch (error) {
      setRunResult({
        output: null,
        error: error instanceof Error ? error.message : "Failed to run code",
        time: null,
        memory: null,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const startPolling = (submissionId: string) => {
    const pollSubmission = async () => {
      try {
        const data = await getCodingSubmission(submissionId);

        if (data.status !== "PENDING") {
          setIsPolling(false);
          setLastSubmission(mapSubmission(data));
          return;
        }
      } catch {
        setIsPolling(false);
        setLastSubmission(ERROR_SUBMISSION);
        return;
      }

      pollingRef.current = setTimeout(pollSubmission, 1500);
    };

    pollingRef.current = setTimeout(pollSubmission, 1500);
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
            setLastSubmission(mapSubmission(initialData));
            return;
          }

          startPolling(initialData.id);
        },
        onError: () => {
          setIsPolling(false);
          setLastSubmission(ERROR_SUBMISSION);
        },
      },
    );
  };

  return {
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
  };
}
