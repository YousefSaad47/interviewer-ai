"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Layers3,
  MessageSquareText,
  Play,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Footer, Header } from "@/features/landing";
import { cn } from "@/lib";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui";

import { useStartInterview } from "../hooks";
import { type InterviewSetupFormData, interviewSetupSchema } from "../schemas";

export function SetupInterviewPage() {
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

  const { isSubmitting, submitInterviewSetup } = useStartInterview();
  const fieldShell =
    "rounded-lg border border-border bg-white/60 p-4 transition-colors focus-within:border-primary/35 focus-within:bg-white/85 dark:bg-surface-secondary/45 dark:focus-within:bg-surface-secondary/75";
  const labelClass = "font-semibold text-foreground text-sm";
  const controlClass =
    "mt-3 h-11 w-full border-border bg-background/80 text-foreground shadow-none hover:bg-background focus:border-primary/45 focus:ring-primary/20 dark:bg-card/70 dark:hover:bg-card";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-25 dark:opacity-45"
        style={{
          backgroundImage: "url(/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
      <div className="pointer-events-none fixed top-24 left-[-140px] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none fixed right-[-120px] bottom-40 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

      <Header />

      <main className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mb-8 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            Mock interview setup
            <span className="h-1 w-1 rounded-full bg-primary" />4 inputs
          </div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
            Build the interview brief
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Choose the role, seniority, and focus area so the session starts
            with the right pressure and signal.
          </p>
        </div>

        <section className="grid overflow-hidden rounded-lg border border-border bg-card/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[320px_minmax(0,1fr)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
          <aside className="relative border-border border-b bg-surface-product/70 p-6 lg:border-r lg:border-b-0 dark:bg-surface-secondary/50">
            <div className="absolute right-0 bottom-0 h-40 w-40 translate-x-12 translate-y-16 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <p className="font-semibold text-foreground text-sm">
                Session anatomy
              </p>
              <p className="mt-2 text-muted-foreground text-sm leading-6">
                A sharper brief produces a sharper mock interview. Keep it
                specific, then add context only when it changes the questions.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  {
                    icon: BriefcaseBusiness,
                    title: "Role signal",
                    text: "Anchors the interview track.",
                  },
                  {
                    icon: Layers3,
                    title: "Difficulty curve",
                    text: "Sets seniority and pace.",
                  },
                  {
                    icon: MessageSquareText,
                    title: "Context",
                    text: "Adds the details that matter.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-border bg-card/65 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {item.title}
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs leading-5">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit(submitInterviewSetup)}>
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className={fieldShell}>
                  <Label htmlFor="target-role" className={labelClass}>
                    Target Role
                  </Label>
                  <Controller
                    name="targetRole"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="target-role"
                          className={cn(
                            controlClass,
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
                          <SelectItem value="mobile">
                            Mobile Developer
                          </SelectItem>
                          <SelectItem value="devops">
                            DevOps Engineer
                          </SelectItem>
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

                <div className={fieldShell}>
                  <Label htmlFor="experience-level" className={labelClass}>
                    Experience Level
                  </Label>
                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="experience-level"
                          className={cn(
                            controlClass,
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

                <div className={fieldShell}>
                  <Label htmlFor="interview-focus" className={labelClass}>
                    Interview Focus
                  </Label>
                  <Controller
                    name="interviewFocus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="interview-focus"
                          className={cn(
                            controlClass,
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
              </div>

              <div className={cn(fieldShell, "mt-4")}>
                <Label htmlFor="additional-context" className={labelClass}>
                  Additional Context
                </Label>
                <Textarea
                  {...register("additionalContext")}
                  id="additional-context"
                  placeholder="Example: Focus on React architecture, async communication, and trade-off questions..."
                  className={cn(
                    "mt-3 min-h-32 resize-none border-border bg-background/80 text-foreground shadow-none placeholder:text-muted-foreground focus:border-primary/45 focus:ring-primary/20 dark:bg-card/70",
                    errors.additionalContext && "border-destructive",
                  )}
                />
                {errors.additionalContext && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.additionalContext.message}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-border border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-muted-foreground text-sm">
                  You can edit these details later. The first question will use
                  this setup as its source of truth.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group h-11 min-w-48 gap-2 rounded-lg bg-primary px-6 font-bold text-primary-foreground shadow-[0_14px_35px_rgba(16,185,129,0.22)] transition-all hover:bg-primary/90 hover:shadow-[0_18px_45px_rgba(16,185,129,0.28)]"
                >
                  <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                  {isSubmitting ? "Starting..." : "Start Interview"}
                </Button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
