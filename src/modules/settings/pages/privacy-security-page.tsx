"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

import { SettingsCard } from "../components/settings-card";
import { SettingsLayout } from "../layouts/settings-layout";

export function PrivacySecurityPage() {
  return (
    <SettingsLayout>
      <div className="mx-auto max-w-[872px]">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <h1 className="text-lg font-bold sm:text-xl">Privacy & Security</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your security settings and data privacy
          </p>
        </div>

        {/* Content */}
        <div className="space-y-7">
          {/* Account Security */}
          <SettingsCard title="Account Security">
            <div className="space-y-3 lg:space-y-4">
              {/* Change Password */}
              <Button
                variant="outline"
                className="h-auto w-full justify-start border-neutral-300 bg-neutral-100 px-5 py-3 text-sm font-normal hover:border-neutral-400 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                Change Password
              </Button>

              {/* View Active Session */}
              <Button
                variant="outline"
                className="h-auto w-full justify-start border-neutral-300 bg-neutral-100 px-5 py-3 text-sm font-normal hover:border-neutral-400 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                View Active Session
              </Button>
            </div>
          </SettingsCard>

          {/* Data Privacy */}
          <SettingsCard title="Data Privacy">
            <div className="space-y-3 lg:space-y-4">
              {/* Download My Data */}
              <Button
                variant="outline"
                className="h-auto w-full justify-start border-neutral-300 bg-neutral-100 px-5 py-3 text-sm font-normal hover:border-neutral-400 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                Download My Data
              </Button>

              {/* Delete Account */}
              <Button
                variant="outline"
                className={cn(
                  "h-auto w-full justify-start px-5 py-3 text-sm font-normal",
                  "bg-destructive/24 border-destructive hover:bg-destructive/30 hover:border-destructive/50"
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
