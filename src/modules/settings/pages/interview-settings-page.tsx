"use client";

import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

import { SettingsCard } from "../components/settings-card";
import { SettingsLayout } from "../layouts/settings-layout";

export function InterviewSettingsPage() {
  return (
    <SettingsLayout>
      <div className="mx-auto max-w-[872px]">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <h1 className="text-lg font-bold sm:text-xl">Interview Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Customize your AI mock interview experience
          </p>
        </div>

        {/* Content */}
        <div className="space-y-7">
          {/* Interview Preferences */}
          <SettingsCard title="Interview Preferences">
            <div className="space-y-4 lg:space-y-5">
              {/* Interview Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm sm:text-base">
                  Interview Difficulty
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger
                    id="difficulty"
                    className="h-12 w-full rounded-xl border-neutral-300 bg-neutral-100 px-5 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm sm:text-base">
                  Interview Type
                </Label>
                <Select defaultValue="video">
                  <SelectTrigger
                    id="type"
                    className="h-12 w-full rounded-xl border-neutral-300 bg-neutral-100 px-5 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Meeting</SelectItem>
                    <SelectItem value="audio">Audio Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Session Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm sm:text-base">
                  Session Duration
                </Label>
                <Select defaultValue="30">
                  <SelectTrigger
                    id="duration"
                    className="h-12 w-full rounded-xl border-neutral-300 bg-neutral-100 px-5 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                  >
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

          {/* Analysis Features */}
          <SettingsCard title="Analysis Features">
            <div className="space-y-4 lg:space-y-5">
              {/* Emotional Analysis */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-foreground mb-1 text-sm font-normal sm:text-base">
                    Emotional Analysis
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Track facial expressions and confidence levels
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Verbal Analysis */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-foreground mb-1 text-sm font-normal sm:text-base">
                    Verbal Analysis
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Analyze speech patterns and filler words
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* AI Suggestions */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-foreground mb-1 text-sm font-normal sm:text-base">
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
