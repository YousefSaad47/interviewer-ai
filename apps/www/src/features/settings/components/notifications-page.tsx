"use client";

import { Switch } from "@/shared/ui/switch";

import { SettingsCard } from "./settings-card";
import { SettingsLayout } from "./settings-layout";

export function NotificationsPage() {
  // TODO(settings-api): Load and persist notification preferences when backend settings endpoints exist.
  return (
    <SettingsLayout>
      <div className="mx-auto max-w-[872px]">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <h1 className="mb-2 font-bold text-foreground text-lg sm:text-xl">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Control how we communicate with you
          </p>
        </div>

        {/* Content */}
        <div className="space-y-7">
          {/* Email Notifications */}
          <SettingsCard title="Email Notifications">
            <div className="space-y-4">
              {/* Interview Reminders */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-1 font-medium text-foreground text-sm sm:text-base">
                    Interview Reminders
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Get notified before scheduled interviews
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Performance Reports */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-1 font-medium text-foreground text-sm sm:text-base">
                    Performance Reports
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Weekly summary of your progress
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Marketing Emails */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-1 font-medium text-foreground text-sm sm:text-base">
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

          {/* Push Notifications */}
          <SettingsCard title="Push Notifications">
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-1 font-medium text-foreground text-sm sm:text-base">
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
