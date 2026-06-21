"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePostApiInterviewStart } from "@repo/kubb";
import { Play } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  type InterviewSetupFormData,
  interviewSetupSchema,
} from "@/modules/interview";
import { Footer, Header } from "@/modules/landing";
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

const FOCUS_TO_CATEGORY: Record<string, string> = {
  algorithms: "ALGORITHMS",
  "system-design": "SYSTEM_DESIGN",
  behavioral: "BEHAVIORAL",
  coding: "FRONTEND",
  architecture: "SYSTEM_DESIGN",
  debugging: "ALGORITHMS",
};

const LEVEL_TO_DIFFICULTY: Record<string, string> = {
  entry: "EASY",
  mid: "EASY",
  senior: "MEDIUM",
  lead: "HARD",
  staff: "HARD",
};

export function SetupInterviewPage() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewSetupFormData>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      targetRole: "",
      experienceLevel: "",
      interviewFocus: "",
      additionalContext: "",
    },
  });

  const { mutate: startInterview, isPending: isSubmitting } =
    usePostApiInterviewStart();

  const onSubmit = (data: InterviewSetupFormData) => {
    startInterview(
      {
        data: {
          category: (FOCUS_TO_CATEGORY[data.interviewFocus] ??
            "BEHAVIORAL") as "BEHAVIORAL",
          difficulty: (LEVEL_TO_DIFFICULTY[data.experienceLevel] ??
            "EASY") as "EASY",
          questionCount: 5,
          targetRole: data.targetRole,
          experienceLevel: data.experienceLevel,
          interviewFocus: data.interviewFocus,
          ...(data.additionalContext && {
            additionalContext: data.additionalContext,
          }),
        },
      },
      {
        onSuccess: (result) => {
          const params = new URLSearchParams({
            interviewId: result.interviewId ?? "",
            accessToken: result.accessToken ?? "",
            configId: result.configId ?? "",
            questionCount: String(result.questionCount ?? 5),
          });
          router.push(`/interview/technical?${params.toString()}`);
        },
      },
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-40 dark:opacity-60"
        style={{
          backgroundImage: "url(/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <Header />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:px-20 lg:pt-32">
        <div className="mb-8 flex flex-col items-center gap-3 sm:mb-12 md:mb-16">
          <h1 className="text-center font-bold text-2xl text-foreground tracking-tight sm:text-3xl md:text-4xl lg:text-[37px]">
            Setup Mock Interview
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg">
            Configure your AI interview session
          </p>
        </div>

        <Card className="w-full max-w-2xl border-neutral-200 bg-neutral-50 backdrop-blur-sm md:max-w-3xl lg:max-w-4xl dark:border-neutral-800 dark:bg-neutral-900">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 md:p-10 lg:gap-10 lg:p-12">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="target-role"
                  className="font-medium text-base text-foreground"
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
                          "h-12 border-neutral-300 bg-neutral-100 text-foreground hover:bg-neutral-200 focus:border-neutral-400 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 dark:hover:bg-neutral-700",
                          errors.targetRole && "border-destructive",
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

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="experience-level"
                  className="font-medium text-base text-foreground"
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
                          "h-12 border-neutral-300 bg-neutral-100 text-foreground hover:bg-neutral-200 focus:border-neutral-400 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 dark:hover:bg-neutral-700",
                          errors.experienceLevel && "border-destructive",
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

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="interview-focus"
                  className="font-medium text-base text-foreground"
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
                          "h-12 border-neutral-300 bg-neutral-100 text-foreground hover:bg-neutral-200 focus:border-neutral-400 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 dark:hover:bg-neutral-700",
                          errors.interviewFocus && "border-destructive",
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

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="additional-context"
                  className="font-medium text-base text-foreground"
                >
                  Additional Context
                </Label>
                <Textarea
                  {...register("additionalContext")}
                  id="additional-context"
                  placeholder="Add any specific topics or requirements..."
                  className={cn(
                    "min-h-25 resize-none border-neutral-300 bg-neutral-100 text-foreground placeholder:text-muted-foreground hover:bg-neutral-200 focus:border-neutral-400 focus:ring-neutral-300 sm:min-h-30 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 dark:hover:bg-neutral-700",
                    errors.additionalContext && "border-destructive",
                  )}
                />
                {errors.additionalContext && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.additionalContext.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="group mt-4 h-12 w-full gap-2 bg-linear-to-r from-primary to-primary/90 font-bold text-base text-primary-foreground shadow-lg transition-all hover:shadow-primary/50 sm:h-14 sm:text-lg"
              >
                <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                {isSubmitting ? "Starting..." : "Start Interview"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
