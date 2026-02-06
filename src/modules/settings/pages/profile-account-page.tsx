"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { SettingsCard } from "../components/settings-card";
import { SettingsLayout } from "../layouts/settings-layout";
import { profileAccountSchema } from "../schemas";

import type { ProfileAccountFormData } from "../schemas";

export function ProfileAccountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileAccountFormData>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: {
      fullName: "John Anderson",
      email: "john.anderson@example.com",
      phone: "+1 (555) 123-4567",
      currentRole: "Senior Software Engineer",
      targetRole: "Principal Engineer",
      experience: "3+ Years",
    },
  });

  const onSubmit = async (data: ProfileAccountFormData) => {
    console.log("Profile data:", data);
    // TODO: Implement actual save logic
  };

  return (
    <SettingsLayout>
      <div className="mx-auto max-w-218">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <h1 className="text-foreground mb-2 text-lg font-bold sm:text-xl">
            Profile & Account
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account information and preferences
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Personal Information */}
          <SettingsCard title="Personal Information">
            <div className="space-y-4 lg:space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-foreground text-sm font-medium"
                >
                  Full Name
                </Label>
                <Input
                  {...register("fullName")}
                  id="fullName"
                  type="text"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.fullName && "border-destructive"
                  )}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground text-sm font-medium"
                >
                  Email Address
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.email && "border-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-foreground text-sm font-medium"
                >
                  Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.phone && "border-destructive"
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

          {/* Professional Details */}
          <SettingsCard title="Professional Details">
            <div className="space-y-4 lg:space-y-5">
              {/* Current Role */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentRole"
                  className="text-foreground text-sm font-medium"
                >
                  Current Role
                </Label>
                <Input
                  {...register("currentRole")}
                  id="currentRole"
                  type="text"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.currentRole && "border-destructive"
                  )}
                />
                {errors.currentRole && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.currentRole.message}
                  </p>
                )}
              </div>

              {/* Target Role */}
              <div className="space-y-2">
                <Label
                  htmlFor="targetRole"
                  className="text-foreground text-sm font-medium"
                >
                  Target Role
                </Label>
                <Input
                  {...register("targetRole")}
                  id="targetRole"
                  type="text"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.targetRole && "border-destructive"
                  )}
                />
                {errors.targetRole && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.targetRole.message}
                  </p>
                )}
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-foreground text-sm font-medium"
                >
                  Years of Experience
                </Label>
                <Input
                  {...register("experience")}
                  id="experience"
                  type="text"
                  className={cn(
                    "h-12 rounded-xl border-neutral-300 bg-neutral-100 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600",
                    errors.experience && "border-destructive"
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

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 h-12 rounded-xl px-8"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
}
