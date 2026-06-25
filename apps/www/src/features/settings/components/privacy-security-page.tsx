"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";

import { SettingsCard } from "./settings-card";
import { SettingsLayout } from "./settings-layout";

export function PrivacySecurityPage() {
  // TODO(settings-api): Connect account security/data privacy actions when backend endpoints exist.
  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            Security
            <span className="h-1 w-1 rounded-full bg-primary" />
            Data controls
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Privacy & Security
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage your security settings and data privacy
          </p>
        </div>

        <div className="space-y-5">
          <SettingsCard
            title="Account Security"
            description="Protect login access and active sessions."
          >
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-auto w-full justify-start rounded-lg border-border bg-white/60 px-4 py-3 font-semibold text-sm hover:border-primary/35 hover:bg-white/85 dark:border-border dark:bg-surface-secondary/55 dark:hover:bg-surface-secondary"
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                className="h-auto w-full justify-start rounded-lg border-border bg-white/60 px-4 py-3 font-semibold text-sm hover:border-primary/35 hover:bg-white/85 dark:border-border dark:bg-surface-secondary/55 dark:hover:bg-surface-secondary"
              >
                View Active Session
              </Button>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Data Privacy"
            description="Export or remove stored account information."
          >
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-auto w-full justify-start rounded-lg border-border bg-white/60 px-4 py-3 font-semibold text-sm hover:border-primary/35 hover:bg-white/85 dark:border-border dark:bg-surface-secondary/55 dark:hover:bg-surface-secondary"
              >
                Download My Data
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "h-auto w-full justify-start rounded-lg px-4 py-3 font-semibold text-sm",
                  "border-destructive/40 bg-destructive/10 text-destructive hover:border-destructive/60 hover:bg-destructive/15",
                )}
              >
                Delete Account
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsLayout>
  );
}
