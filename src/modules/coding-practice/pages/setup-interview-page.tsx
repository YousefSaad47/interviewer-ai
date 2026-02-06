"use client";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { interviewSetupSchema } from "@/modules/interview/schemas";
import { Footer, Header } from "@/modules/landing/components";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import type { InterviewSetupFormData } from "@/modules/interview/schemas";

export function SetupInterviewPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterviewSetupFormData>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      targetRole: "",
      experienceLevel: "",
      interviewFocus: "",
      interviewType: "",
      additionalContext: "",
    },
  });

  const onSubmit = async (data: InterviewSetupFormData) => {
    console.log("Interview setup data:", data);
    // TODO: Implement actual interview start logic
  };

  return (
    <div className="bg-background relative min-h-screen w-full">
      {/* Background Effects */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40 dark:opacity-60"
        style={{
          backgroundImage: "url(/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:px-20 lg:pt-32">
        {/* Title and Description */}
        <div className="mb-8 flex flex-col items-center gap-3 sm:mb-12 md:mb-16">
          <h1 className="text-foreground text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[37px]">
            Setup Mock Interview
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base md:text-lg">
            Configure your AI interview session
          </p>
        </div>

        {/* Setup Form Card */}
        <Card className="border-primary/20 bg-card/50 w-full max-w-2xl backdrop-blur-sm md:max-w-3xl lg:max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 md:p-10 lg:gap-10 lg:p-12">
              {/* Target Role */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="target-role"
                  className="text-foreground text-base font-medium"
                >
                  Target Role
                </Label>
                <Controller
                  name="targetRole"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="target-role"
                        className={cn(
                          "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 focus:border-primary/50 focus:ring-primary/20 h-12",
                          errors.targetRole && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">
                          Frontend Developer
                        </SelectItem>
                        <SelectItem value="backend">
                          Backend Developer
                        </SelectItem>
                        <SelectItem value="fullstack">
                          Full Stack Developer
                        </SelectItem>
                        <SelectItem value="mobile">Mobile Developer</SelectItem>
                        <SelectItem value="devops">DevOps Engineer</SelectItem>
                        <SelectItem value="data">Data Scientist</SelectItem>
                        <SelectItem value="ml">ML Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.targetRole && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.targetRole.message}
                  </p>
                )}
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="experience-level"
                  className="text-foreground text-base font-medium"
                >
                  Experience Level
                </Label>
                <Controller
                  name="experienceLevel"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="experience-level"
                        className={cn(
                          "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 focus:border-primary/50 focus:ring-primary/20 h-12",
                          errors.experienceLevel && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">
                          Entry Level (0-2 years)
                        </SelectItem>
                        <SelectItem value="mid">
                          Mid Level (2-5 years)
                        </SelectItem>
                        <SelectItem value="senior">
                          Senior (5-8 years)
                        </SelectItem>
                        <SelectItem value="lead">Lead (8+ years)</SelectItem>
                        <SelectItem value="staff">Staff/Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.experienceLevel && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.experienceLevel.message}
                  </p>
                )}
              </div>

              {/* Interview Focus */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="interview-focus"
                  className="text-foreground text-base font-medium"
                >
                  Interview Focus
                </Label>
                <Controller
                  name="interviewFocus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="interview-focus"
                        className={cn(
                          "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 focus:border-primary/50 focus:ring-primary/20 h-12",
                          errors.interviewFocus && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select Focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algorithms">
                          Algorithms & Data Structures
                        </SelectItem>
                        <SelectItem value="system-design">
                          System Design
                        </SelectItem>
                        <SelectItem value="behavioral">
                          Behavioral Questions
                        </SelectItem>
                        <SelectItem value="coding">
                          Coding Challenges
                        </SelectItem>
                        <SelectItem value="architecture">
                          Architecture & Patterns
                        </SelectItem>
                        <SelectItem value="debugging">
                          Debugging & Problem Solving
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.interviewFocus && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.interviewFocus.message}
                  </p>
                )}
              </div>

              {/* Interview Type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="interview-type"
                  className="text-foreground text-base font-medium"
                >
                  Interview Type
                </Label>
                <Controller
                  name="interviewType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="interview-type"
                        className={cn(
                          "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 focus:border-primary/50 focus:ring-primary/20 h-12",
                          errors.interviewType && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">
                          Technical Round
                        </SelectItem>
                        <SelectItem value="screening">
                          Phone Screening
                        </SelectItem>
                        <SelectItem value="onsite">
                          On-site Interview
                        </SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                        <SelectItem value="mock">Practice Mock</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.interviewType && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.interviewType.message}
                  </p>
                )}
              </div>

              {/* Additional Context */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="additional-context"
                  className="text-foreground text-base font-medium"
                >
                  Additional Context
                </Label>
                <Textarea
                  {...register("additionalContext")}
                  id="additional-context"
                  placeholder="Add any specific topics or requirements..."
                  className={cn(
                    "border-primary/30 bg-primary/10 text-foreground placeholder:text-muted-foreground hover:bg-primary/15 focus:border-primary/50 focus:ring-primary/20 min-h-25 resize-none sm:min-h-30",
                    errors.additionalContext && "border-destructive"
                  )}
                />
                {errors.additionalContext && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.additionalContext.message}
                  </p>
                )}
              </div>

              {/* Start Interview Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="group from-primary to-primary/90 text-primary-foreground hover:shadow-primary/50 mt-4 h-12 w-full gap-2 bg-gradient-to-r text-base font-bold shadow-lg transition-all sm:h-14 sm:text-lg"
              >
                <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                {isSubmitting ? "Starting..." : "Start Interview"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
