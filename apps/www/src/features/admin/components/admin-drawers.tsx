"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Skeleton } from "@/shared/ui";

import type {
  AdminInterview,
  AdminResume,
  AdminUser,
  DrawerContent,
} from "../types";
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

export function UserDrawer({ user }: { user: AdminUser }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div>
            <p className="font-semibold">{user.email}</p>
            <p className="text-muted-foreground text-sm">
              Joined {user.date} · {user.plan}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DrawerStat label="Interviews" value={user.interviews} />
        <DrawerStat label="Coding" value={user.coding} />
        <DrawerStat label="Resumes" value={user.resumes} />
      </div>
      <DetailBlock
        title="Account signals"
        items={["Email verified", "2FA recommended", "No billing alerts"]}
      />
    </div>
  );
}

export function InterviewDrawer({ interview }: { interview: AdminInterview }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <DrawerStat label="Overall Score" value={`${interview.score}%`} />
        <DrawerStat label="Duration" value={interview.duration} />
        <DrawerStat label="Communication" value="86%" />
        <DrawerStat label="Technical" value="91%" />
        <DrawerStat label="Confidence" value="78%" />
        <DrawerStat label="Status" value={interview.status} />
      </div>
      <DetailBlock
        title="Transcript Preview"
        items={[
          "Candidate clarified scope before proposing architecture.",
          "Strong tradeoff discussion around caching and consistency.",
          "Follow-up recommended for observability and failure modes.",
        ]}
      />
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
