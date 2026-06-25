"use client";

import { cn } from "@/lib";
import { Button, Input, Label } from "@/shared/ui";

import { useProfileAccountForm } from "../hooks";
import { SettingsCard } from "./settings-card";
import { SettingsLayout } from "./settings-layout";

export function ProfileAccountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useProfileAccountForm();
  const inputClass =
    "h-10 rounded-lg border-border bg-white/70 shadow-none focus:border-primary/45 focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70 dark:focus:border-border-interactive";
  const labelClass = "font-semibold text-foreground text-xs";

  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            Account center
            <span className="h-1 w-1 rounded-full bg-primary" />
            Profile
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Profile & Account
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <SettingsCard
            title="Personal Information"
            description="The identity details used across your interview workspace."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={labelClass}>
                  Full Name
                </Label>
                <Input
                  {...register("fullName")}
                  id="fullName"
                  type="text"
                  className={cn(
                    inputClass,
                    errors.fullName && "border-destructive",
                  )}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>
                  Email Address
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={cn(
                    inputClass,
                    errors.email && "border-destructive",
                  )}
                />
                {errors.email && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className={labelClass}>
                  Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  className={cn(
                    inputClass,
                    errors.phone && "border-destructive",
                  )}
                />
                {errors.phone && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Professional Details"
            description="Help the assistant calibrate interview difficulty and role context."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentRole" className={labelClass}>
                  Current Role
                </Label>
                <Input
                  {...register("currentRole")}
                  id="currentRole"
                  type="text"
                  className={cn(
                    inputClass,
                    errors.currentRole && "border-destructive",
                  )}
                />
                {errors.currentRole && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.currentRole.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetRole" className={labelClass}>
                  Target Role
                </Label>
                <Input
                  {...register("targetRole")}
                  id="targetRole"
                  type="text"
                  className={cn(
                    inputClass,
                    errors.targetRole && "border-destructive",
                  )}
                />
                {errors.targetRole && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.targetRole.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className={labelClass}>
                  Years of Experience
                </Label>
                <Input
                  {...register("experience")}
                  id="experience"
                  type="text"
                  className={cn(
                    inputClass,
                    errors.experience && "border-destructive",
                  )}
                />
                {errors.experience && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          </SettingsCard>

          <div className="flex justify-end rounded-lg border border-border bg-card/70 p-3 backdrop-blur-xl">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
}
