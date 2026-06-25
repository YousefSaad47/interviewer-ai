"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import { useResume } from "../contexts";
import type { PersonalInfoFormData } from "../schemas";
import { personalInfoSchema } from "../schemas";

export const PersonalInfoSection = () => {
  const { data, updatePersonalInfo } = useResume();
  const { personalInfo } = data;

  const {
    register,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: personalInfo,
  });

  return (
    <Card className="rounded-[15px] border-border bg-card dark:bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-foreground text-xl">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Row 1 */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-sm">Full Name</Label>
            <Input
              {...register("fullName", {
                onChange: (e) =>
                  updatePersonalInfo({ fullName: e.target.value }),
              })}
              type="text"
              className={cn(
                "rounded-lg border-border bg-white dark:border-border dark:bg-surface-secondary",
                errors.fullName && "border-destructive",
              )}
            />
            {errors.fullName && (
              <p className="text-destructive text-xs">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-sm">Email</Label>
            <Input
              {...register("email", {
                onChange: (e) => updatePersonalInfo({ email: e.target.value }),
              })}
              type="email"
              className={cn(
                "rounded-lg border-border bg-white dark:border-border dark:bg-surface-secondary",
                errors.email && "border-destructive",
              )}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-sm">Phone</Label>
            <Input
              {...register("phone", {
                onChange: (e) => updatePersonalInfo({ phone: e.target.value }),
              })}
              type="tel"
              className={cn(
                "rounded-lg border-border bg-white dark:border-border dark:bg-surface-secondary",
                errors.phone && "border-destructive",
              )}
            />
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-sm">Location</Label>
            <Input
              {...register("location", {
                onChange: (e) =>
                  updatePersonalInfo({ location: e.target.value }),
              })}
              type="text"
              className={cn(
                "rounded-lg border-border bg-white dark:border-border dark:bg-surface-secondary",
                errors.location && "border-destructive",
              )}
            />
            {errors.location && (
              <p className="text-destructive text-xs">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">
            Professional Summary
          </Label>
          <Textarea
            {...register("summary", {
              onChange: (e) => updatePersonalInfo({ summary: e.target.value }),
            })}
            rows={3}
            className={cn(
              "rounded-lg border-border bg-white dark:border-border dark:bg-surface-secondary",
              errors.summary && "border-destructive",
            )}
          />
          {errors.summary && (
            <p className="text-destructive text-xs">{errors.summary.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
