"use client";

import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";

import { SettingsCard } from "./settings-card";
import { SettingsLayout } from "./settings-layout";

export function InterviewSettingsPage() {
  // TODO(settings-api): Load and persist interview preferences when backend settings endpoints exist.
  const selectClass =
    "h-10 w-full rounded-lg border-border bg-white/70 px-3 shadow-none hover:border-primary/35 focus:ring-primary/20 dark:border-border dark:bg-surface-secondary/70 dark:hover:border-border-interactive";

  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            Interview engine
            <span className="h-1 w-1 rounded-full bg-primary" />
            Preferences
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Interview Settings
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Customize your AI mock interview experience
          </p>
        </div>

        <div className="space-y-5">
          <SettingsCard
            title="Interview Preferences"
            description="Control the shape, pace, and format of your sessions."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="difficulty"
                  className="font-semibold text-foreground text-xs"
                >
                  Interview Difficulty
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="difficulty" className={selectClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="font-semibold text-foreground text-xs"
                >
                  Interview Type
                </Label>
                <Select defaultValue="video">
                  <SelectTrigger id="type" className={selectClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Meeting</SelectItem>
                    <SelectItem value="audio">Audio Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="font-semibold text-foreground text-xs"
                >
                  Session Duration
                </Label>
                <Select defaultValue="30">
                  <SelectTrigger id="duration" className={selectClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Analysis Features"
            description="Choose which signals the AI should read during practice."
          >
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Emotional Analysis
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Track facial expressions and confidence levels
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Verbal Analysis
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Analyze speech patterns and filler words
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    AI Suggestions
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Receive real-time improvement tips
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsLayout>
  );
}
