"use client";

import { Switch } from "@/shared/ui/switch";

import { SettingsCard } from "./settings-card";
import { SettingsLayout } from "./settings-layout";

export function NotificationsPage() {
  // TODO(settings-api): Load and persist notification preferences when backend settings endpoints exist.
  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            Signal routing
            <span className="h-1 w-1 rounded-full bg-primary" />
            Notifications
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Notifications
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Control how we communicate with you
          </p>
        </div>

        <div className="space-y-5">
          <SettingsCard
            title="Email Notifications"
            description="Decide what deserves to land in your inbox."
          >
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Interview Reminders
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Get notified before scheduled interviews
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Performance Reports
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Weekly summary of your progress
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Marketing Emails
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Tips, updates, and promotional content
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Push Notifications"
            description="Short alerts for time-sensitive interview work."
          >
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55">
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-foreground text-sm">
                    Email Notifications
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Receive notifications via email
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
