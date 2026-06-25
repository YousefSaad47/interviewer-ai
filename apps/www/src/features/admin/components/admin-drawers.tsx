"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Skeleton } from "@/shared/ui";

import { useAdminInterviewDetails, useAdminUserDetails } from "../hooks";
import type {
  AdminInterview,
  AdminResume,
  AdminUser,
  DrawerContent,
} from "../types";
import { mapAdminInterviewDetails, mapAdminUserDetails } from "../utils";
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
