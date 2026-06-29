"use client";

import { useParams, useRouter } from "next/navigation";

import { useGetApiInterviewId } from "@repo/kubb";
import { Brain, MessageSquare, Target, Trophy } from "lucide-react";

import { Header } from "@/features/landing";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui";

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-muted-foreground">--</span>;
  const color =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";
  return (
    <span className={`font-bold text-lg ${color}`}>{Math.round(score)}%</span>
  );
}

function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const value = score ?? 0;
  const color =
    value >= 80
      ? "bg-emerald-500"
      : value >= 60
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-strong dark:bg-surface-elevated">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function InterviewResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useGetApiInterviewId(params.id, {
    query: {
      refetchInterval: 3000,
      staleTime: 0,
    },
  });

  const hasFeedback = data?.questions?.some((q) =>
    q.answers?.some((a) =>
      a.feedback?.some(
        (f) => f.overallScore != null || f.strengths?.length > 0,
      ),
    ),
  );

  const isSyncing = !isLoading && data && !hasFeedback;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6 pt-24">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Interview not found</p>
      </div>
    );
  }

  const allFeedback = data.questions.flatMap((q) =>
    q.answers.flatMap((a) => a.feedback),
  );
  const avgFluency =
    allFeedback.length > 0
      ? Math.round(
          allFeedback.reduce((sum, f) => sum + (f.fluencyScore ?? 0), 0) /
            allFeedback.length,
        )
      : null;
  const avgClarity =
    allFeedback.length > 0
      ? Math.round(
          allFeedback.reduce((sum, f) => sum + (f.clarityScore ?? 0), 0) /
            allFeedback.length,
        )
      : null;
  const avgConfidence =
    allFeedback.length > 0
      ? Math.round(
          allFeedback.reduce((sum, f) => sum + (f.confidenceScore ?? 0), 0) /
            allFeedback.length,
        )
      : null;
  const totalFillerWords = allFeedback.reduce(
    (sum, f) => sum + (f.fillerWordCount ?? 0),
    0,
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Header />

      <main className="mx-auto max-w-4xl space-y-6 px-6 pt-32 pb-20">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Target className="h-4 w-4" />
            <span>{data.category.replace(/_/g, " ")}</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="capitalize">{data.difficulty.toLowerCase()}</span>
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Interview Results
          </h1>
          {isSyncing && (
            <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-600 text-xs dark:text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              AI is analyzing your answers&hellip;
            </div>
          )}
          <p className="text-muted-foreground">
            {new Date(data.startedAt).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
            {data.durationSeconds != null &&
              ` · ${Math.round(data.durationSeconds / 60)} min`}
          </p>
        </div>

        <Card className="overflow-hidden rounded-lg border-border bg-card/80">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2 font-bold text-xl">
              <Trophy className="h-5 w-5 text-primary" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/30 bg-card/90">
                <div className="text-center">
                  <p className="font-bold text-4xl text-foreground">
                    {data.overallScore != null ? `${data.overallScore}%` : "--"}
                  </p>
                  <p className="text-muted-foreground text-xs">overall</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ScoreBar score={avgFluency} label="Fluency" />
              <ScoreBar score={avgClarity} label="Clarity" />
              <ScoreBar score={avgConfidence} label="Confidence" />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Filler Words</span>
                  <span className="font-semibold">{totalFillerWords}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-foreground text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Questions & Answers
          </h2>

          {data.questions.map((question, qi) => (
            <Card
              key={question.id}
              className="overflow-hidden rounded-lg border-border bg-card/80"
            >
              <div className="border-border border-b bg-card/50 px-5 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                      {qi + 1}
                    </div>
                    <div>
                      <p className="mt-0.5 text-muted-foreground text-xs capitalize">
                        {question.category.replace(/_/g, " ")} ·{" "}
                        {question.difficulty.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {question.answers.map((answer) => (
                <div key={answer.id}>
                  {answer.transcript && (
                    <div className="border-border border-b px-5 py-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          {answer.transcript}
                        </p>
                      </div>
                    </div>
                  )}

                  {answer.feedback.map((fb) => (
                    <div key={fb.id} className="space-y-4 p-5">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg bg-card/60 p-3 text-center">
                          <p className="text-muted-foreground text-xs">Score</p>
                          <ScoreBadge score={fb.overallScore} />
                        </div>
                        <div className="rounded-lg bg-card/60 p-3 text-center">
                          <p className="text-muted-foreground text-xs">
                            Relevance
                          </p>
                          <ScoreBadge score={fb.relevanceScore} />
                        </div>
                        <div className="rounded-lg bg-card/60 p-3 text-center">
                          <p className="text-muted-foreground text-xs">
                            Technical
                          </p>
                          <ScoreBadge score={fb.technicalAccuracy} />
                        </div>
                        <div className="rounded-lg bg-card/60 p-3 text-center">
                          <p className="text-muted-foreground text-xs">
                            Detail
                          </p>
                          <span className="text-muted-foreground text-sm">
                            {fb.detailLevel ?? "--"}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {fb.strengths.length > 0 && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                            <p className="mb-2 font-semibold text-emerald-600 text-xs uppercase dark:text-emerald-400">
                              Strengths
                            </p>
                            <ul className="space-y-1">
                              {fb.strengths.map((s, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-muted-foreground text-sm"
                                >
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {fb.improvements.length > 0 && (
                          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5">
                            <p className="mb-2 font-semibold text-amber-600 text-xs uppercase dark:text-amber-400">
                              Improvements
                            </p>
                            <ul className="space-y-1">
                              {fb.improvements.map((imp, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-muted-foreground text-sm"
                                >
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                  {imp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {fb.idealAnswer && (
                        <div className="rounded-lg border border-border bg-card/50 p-3.5">
                          <div className="mb-2 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary text-xs uppercase">
                              Ideal Answer
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {fb.idealAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-primary-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
