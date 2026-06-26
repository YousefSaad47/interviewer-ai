"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Skeleton } from "@/shared/ui";

import {
  useAdminCodingSubmissionDetails,
  useAdminInterviewDetails,
  useAdminUserDetails,
} from "../hooks";
import type {
  AdminCodingSubmission,
  AdminInterview,
  AdminResume,
  AdminUser,
  DrawerContent,
} from "../types";
import {
  mapAdminCodingSubmissionDetails,
  mapAdminInterviewDetails,
  mapAdminUserDetails,
} from "../utils";
import { Avatar, DetailBlock, DrawerStat, ScorePill } from "./admin-primitives";

export function DetailDrawer({
  drawer,
  onClose,
}: {
  drawer: DrawerContent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {drawer && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/72 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            animate={{ x: 0 }}
            className="absolute top-0 right-0 h-full w-full max-w-[480px] overflow-y-auto border-border border-l bg-background p-6 shadow-2xl"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-primary text-xs uppercase">
                  {drawer.eyebrow}
                </p>
                <h2 className="mt-1 font-bold text-2xl text-heading">
                  {drawer.title}
                </h2>
              </div>
              <Button
                aria-label="Close drawer"
                onClick={onClose}
                size="icon"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </div>
            {drawer.body}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function UserDrawer({
  fetchDetails = false,
  user,
}: {
  fetchDetails?: boolean;
  user: AdminUser;
}) {
  const detailsQuery = useAdminUserDetails(fetchDetails ? user.id : null);
  const details = detailsQuery.data
    ? mapAdminUserDetails(detailsQuery.data)
    : null;
  const displayUser = details ?? user;

  if (fetchDetails && detailsQuery.isLoading) {
    return <DrawerSkeleton />;
  }

  if (fetchDetails && detailsQuery.isError) {
    return (
      <DrawerError
        message="Unable to load user details."
        onRetry={() => detailsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar name={displayUser.name} />
          <div>
            <p className="font-semibold">{displayUser.email}</p>
            <p className="text-muted-foreground text-sm">
              Joined {displayUser.date} - {displayUser.plan}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DrawerStat label="Interviews" value={displayUser.interviews} />
        <DrawerStat label="Coding" value={displayUser.coding} />
        <DrawerStat label="Resumes" value={displayUser.resumes} />
      </div>
      <DetailBlock
        title="Account signals"
        items={[
          displayUser.emailVerified ? "Email verified" : "Email not verified",
          `Status: ${displayUser.status}`,
          `Last login: ${details?.lastLoginLabel ?? "Not loaded"}`,
        ]}
      />
      {details && (
        <DetailBlock
          title="Recent activity"
          items={
            details.recentActivity.length > 0
              ? details.recentActivity.map(
                  (activity) =>
                    `${activity.type}: ${activity.title} - ${activity.createdAtLabel}`,
                )
              : ["No recent activity"]
          }
        />
      )}
    </div>
  );
}

export function InterviewDrawer({
  fetchDetails = false,
  interview,
}: {
  fetchDetails?: boolean;
  interview: AdminInterview;
}) {
  const detailsQuery = useAdminInterviewDetails(
    fetchDetails ? interview.id : null,
  );
  const details = detailsQuery.data
    ? mapAdminInterviewDetails(detailsQuery.data)
    : null;
  const displayInterview = details ?? interview;

  if (fetchDetails && detailsQuery.isLoading) {
    return <DrawerSkeleton />;
  }

  if (fetchDetails && detailsQuery.isError) {
    return (
      <DrawerError
        message="Unable to load interview details."
        onRetry={() => detailsQuery.refetch()}
      />
    );
  }

  const transcriptItems = details?.questions
    .flatMap((question) =>
      question.answers.map(
        (answer) =>
          answer.transcript ??
          `Question ${question.sortOrder + 1}: No transcript recorded`,
      ),
    )
    .slice(0, 4) ?? [
    "Candidate clarified scope before proposing architecture.",
    "Strong tradeoff discussion around caching and consistency.",
    "Follow-up recommended for observability and failure modes.",
  ];

  const feedbackItems =
    details?.questions
      .flatMap((question) =>
        question.answers.flatMap((answer) =>
          answer.feedback.flatMap((feedback) => [
            ...feedback.strengths,
            ...feedback.improvements,
          ]),
        ),
      )
      .filter((item) => item.trim().length > 0)
      .slice(0, 5) ?? [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <DrawerStat
          label="Overall Score"
          value={
            displayInterview.score === null
              ? "--"
              : `${displayInterview.score}%`
          }
        />
        <DrawerStat label="Duration" value={displayInterview.duration} />
        <DrawerStat
          label="Communication"
          value={
            details?.scores.communication === null || !details
              ? "--"
              : `${details.scores.communication}%`
          }
        />
        <DrawerStat
          label="Technical"
          value={
            details?.scores.technical === null || !details
              ? "--"
              : `${details.scores.technical}%`
          }
        />
        <DrawerStat
          label="Confidence"
          value={
            details?.scores.confidence === null || !details
              ? "--"
              : `${details.scores.confidence}%`
          }
        />
        <DrawerStat label="Status" value={displayInterview.status} />
      </div>
      {details && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-heading">Session summary</p>
            <ScorePill value={details.score} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <span className="text-muted-foreground">Questions</span>
            <span className="text-right font-medium">
              {details.answeredQuestionCount}/{details.questionCount}
            </span>
            <span className="text-muted-foreground">Started</span>
            <span className="text-right font-medium">{details.date}</span>
            <span className="text-muted-foreground">Candidate</span>
            <span className="text-right font-medium">{details.candidate}</span>
          </div>
        </div>
      )}
      <DetailBlock
        title="Transcript Preview"
        items={
          transcriptItems.length > 0 ? transcriptItems : ["No answers yet"]
        }
      />
      {details && (
        <DetailBlock
          title="Feedback"
          items={feedbackItems.length > 0 ? feedbackItems : ["No feedback yet"]}
        />
      )}
    </div>
  );
}

export function ResumeDrawer({ resume }: { resume: AdminResume }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-heading">Resume Preview</p>
          <ScorePill value={resume.score} />
        </div>
        <Skeleton className="mb-2 h-3 w-5/6" />
        <Skeleton className="mb-2 h-3 w-full" />
        <Skeleton className="mb-2 h-3 w-4/5" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <DetailBlock
        title="Skills"
        items={["React", "TypeScript", "Design systems", "Accessibility"]}
      />
      <DetailBlock
        title="ATS Breakdown"
        items={["Keywords: 91%", "Formatting: 96%", "Impact language: 82%"]}
      />
      <DetailBlock
        title="Suggestions"
        items={[
          "Add measurable outcomes to the latest role.",
          "Move testing tools into the skills summary.",
        ]}
      />
    </div>
  );
}

export function CodingDrawer({
  submission,
}: {
  submission: AdminCodingSubmission;
}) {
  const detailsQuery = useAdminCodingSubmissionDetails(submission.id);
  const details = detailsQuery.data
    ? mapAdminCodingSubmissionDetails(detailsQuery.data)
    : null;
  const display = details ?? submission;

  if (detailsQuery.isLoading) {
    return <DrawerSkeleton />;
  }

  if (detailsQuery.isError) {
    return (
      <DrawerError
        message="Unable to load submission details."
        onRetry={() => detailsQuery.refetch()}
      />
    );
  }

  const scoreLabel = (value: number | null) =>
    value === null ? "--" : `${value}%`;

  return (
    <div className="space-y-5">
      {/* ── Candidate + Problem ─────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-heading">{display.problem}</p>
          <ScorePill value={display.score} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <span className="text-muted-foreground">Candidate</span>
          <span className="text-right font-medium">{display.candidate}</span>
          <span className="text-muted-foreground">Language</span>
          <span className="text-right font-medium">{display.language}</span>
          <span className="text-muted-foreground">Difficulty</span>
          <span className="text-right font-medium">{display.difficulty}</span>
          <span className="text-muted-foreground">Submitted</span>
          <span className="text-right font-medium">{display.date}</span>
          {display.executionTimeMs !== null && (
            <>
              <span className="text-muted-foreground">Runtime</span>
              <span className="text-right font-medium">
                {display.executionTimeMs} ms
              </span>
            </>
          )}
          {display.memoryUsedKb !== null && (
            <>
              <span className="text-muted-foreground">Memory</span>
              <span className="text-right font-medium">
                {display.memoryUsedKb} KB
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── AI Dimension Scores ──────────────────────────── */}
      {details && (
        <div className="grid grid-cols-2 gap-3">
          <DrawerStat label="Logic" value={scoreLabel(details.scores.logic)} />
          <DrawerStat
            label="Naming"
            value={scoreLabel(details.scores.naming)}
          />
          <DrawerStat
            label="Efficiency"
            value={scoreLabel(details.scores.efficiency)}
          />
          <DrawerStat
            label="Best Practices"
            value={scoreLabel(details.scores.bestPractices)}
          />
        </div>
      )}

      {/* ── Problem Description ──────────────────────────── */}
      {details?.problemDescription && (
        <DetailBlock title="Problem" items={[details.problemDescription]} />
      )}

      {/* ── Source Code ─────────────────────────────────── */}
      {details?.code && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 font-semibold text-heading text-sm">Source Code</p>
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
            {details.code}
          </pre>
        </div>
      )}

      {/* ── AI Feedback ─────────────────────────────────── */}
      {details && (
        <DetailBlock
          title="AI Feedback"
          items={
            details.aiFeedback
              ? [details.aiFeedback]
              : ["No AI feedback available."]
          }
        />
      )}

      {/* ── Test Results ─────────────────────────────────── */}
      {details && details.results.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 font-semibold text-heading text-sm">
            Test Results
          </p>
          <div className="space-y-2">
            {details.results.map((result) => (
              <div
                className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface-secondary/40 p-3 text-sm"
                key={result.id}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-heading">
                    Test {result.testCase.sortOrder + 1}
                    {result.testCase.isHidden && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        (hidden)
                      </span>
                    )}
                  </p>
                  {!result.testCase.isHidden && result.testCase.input && (
                    <p className="mt-1 font-mono text-muted-foreground text-xs">
                      Input: {result.testCase.input}
                    </p>
                  )}
                  {result.error && (
                    <p className="mt-1 font-mono text-destructive text-xs">
                      {result.error}
                    </p>
                  )}
                  {!result.error && result.output && (
                    <p className="mt-1 font-mono text-muted-foreground text-xs">
                      Output: {result.output}
                    </p>
                  )}
                </div>
                <span
                  className={
                    result.passed
                      ? "shrink-0 font-semibold text-green-600 text-xs dark:text-green-400"
                      : "shrink-0 font-semibold text-destructive text-xs"
                  }
                >
                  {result.passed ? "Passed" : "Failed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-20 rounded-lg" key={`drawer-stat-${index}`} />
        ))}
      </div>
      <Skeleton className="h-36 w-full rounded-lg" />
    </div>
  );
}

function DrawerError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <p className="font-medium text-heading text-sm">{message}</p>
      <Button className="mt-4 rounded-lg" onClick={onRetry} variant="outline">
        Retry
      </Button>
    </div>
  );
}
