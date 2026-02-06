"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { useResume } from "../contexts";
import { personalInfoSchema } from "../schemas";

import type { PersonalInfoFormData } from "../schemas";

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
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-xl font-bold">
          <User className="text-primary h-5 w-5" />
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
                "rounded-lg border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
                errors.fullName && "border-destructive"
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
                "rounded-lg border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
                errors.email && "border-destructive"
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
                "rounded-lg border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
                errors.phone && "border-destructive"
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
                "rounded-lg border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
                errors.location && "border-destructive"
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
              "rounded-lg border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
              errors.summary && "border-destructive"
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
