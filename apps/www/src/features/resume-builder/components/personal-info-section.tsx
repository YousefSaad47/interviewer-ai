"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@/shared/ui";

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
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="flex items-center gap-2 font-bold text-foreground text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </span>
          Personal Information
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          The header details that anchor the resume.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex-1 space-y-2">
            <Label className="font-semibold text-foreground text-xs">
              Full Name
            </Label>
            <Input
              {...register("fullName", {
                onChange: (e) =>
                  updatePersonalInfo({ fullName: e.target.value }),
              })}
              type="text"
              className={cn(
                "h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70",
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
            <Label className="font-semibold text-foreground text-xs">
              Email
            </Label>
            <Input
              {...register("email", {
                onChange: (e) => updatePersonalInfo({ email: e.target.value }),
              })}
              type="email"
              className={cn(
                "h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70",
                errors.email && "border-destructive",
              )}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label className="font-semibold text-foreground text-xs">
              Phone
            </Label>
            <Input
              {...register("phone", {
                onChange: (e) => updatePersonalInfo({ phone: e.target.value }),
              })}
              type="tel"
              className={cn(
                "h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70",
                errors.phone && "border-destructive",
              )}
            />
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label className="font-semibold text-foreground text-xs">
              Location
            </Label>
            <Input
              {...register("location", {
                onChange: (e) =>
                  updatePersonalInfo({ location: e.target.value }),
              })}
              type="text"
              className={cn(
                "h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70",
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

        <div className="space-y-2">
          <Label className="font-semibold text-foreground text-xs">
            Professional Summary
          </Label>
          <Textarea
            {...register("summary", {
              onChange: (e) => updatePersonalInfo({ summary: e.target.value }),
            })}
            rows={3}
            className={cn(
              "min-h-24 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border dark:bg-surface-secondary/70",
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
