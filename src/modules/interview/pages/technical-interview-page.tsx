"use client";

import { Clock, Target } from "lucide-react";

import { Footer, Header } from "@/modules/landing/components";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

export function TechnicalInterviewPage() {
  return (
    <div className="bg-background relative min-h-screen w-full overflow-x-hidden">
      {/* Background Effects - Only visible in dark mode */}
      <div className="pointer-events-none fixed inset-0 opacity-0 dark:opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/noise-texture.png')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 opacity-0 dark:opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/mesh.svg')",
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:px-20 lg:pt-32">
        {/* Top Cards Section */}
        <div className="mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:gap-7">
          {/* Interview Details Card */}
          <div className="w-full lg:flex-1">
            <div className="bg-card/80 flex flex-col gap-4 rounded-3xl p-4 shadow-lg backdrop-blur-sm sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:rounded-[40px] lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:gap-6 lg:gap-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <svg
                    width="51"
                    height="43"
                    viewBox="0 0 61 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-12 shrink-0 sm:h-12 sm:w-14 lg:h-[51px] lg:w-[61px]"
                  >
                    <path
                      d="M30.5 0L0 15L30.5 30L61 15L30.5 0Z"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground text-xl leading-tight font-semibold sm:text-2xl lg:text-[26.75px]">
                      Technical Interview
                    </h2>
                    <p className="text-muted-foreground text-sm leading-tight sm:text-base lg:text-[14.66px]">
                      Data structures, algorithms, and system design questions
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-5">
                  <div className="bg-primary/20 flex items-center gap-2 rounded-lg px-4 py-2 sm:px-5 sm:py-3">
                    <Clock className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-foreground text-sm font-medium sm:text-base">
                      45-60 min
                    </span>
                  </div>
                  <div className="bg-primary/20 flex items-center gap-2 rounded-lg px-4 py-2 sm:px-5 sm:py-3">
                    <Target className="text-primary h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
                    <span className="text-foreground text-sm font-medium sm:text-base">
                      8 Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-start md:justify-end">
                <div className="bg-background inline-flex items-center justify-center rounded-full px-5 py-1 shadow-sm sm:px-6 sm:py-1.5">
                  <span className="text-foreground text-sm font-medium sm:text-base">
                    Medium
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <Card className="bg-card/80 border-primary/20 mt-6 rounded-3xl p-6 backdrop-blur-sm lg:rounded-[40px] lg:p-8">
              <div className="flex w-full flex-col gap-4 lg:gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-base font-medium sm:text-lg">
                    Interview Progress
                  </span>
                  <span className="text-foreground text-base font-medium sm:text-lg">
                    20% Complete
                  </span>
                </div>
                <div className="relative h-2.5 w-full">
                  <div className="bg-muted h-full w-full rounded-full" />
                  <div className="bg-primary absolute top-0 left-0 h-full w-1/5 rounded-full" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Interview Cards and Session Overview */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left - Interview Cards */}
          <div className="flex w-full flex-col gap-6 lg:flex-1 lg:gap-7">
            {/* AI-Powered Interview Card */}
            <Card className="border-border/10 bg-card/70 rounded-2xl p-6 backdrop-blur-sm lg:rounded-3xl lg:p-7">
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <path
                      d="M16.5 0L0 10L16.5 20L33 10L16.5 0Z"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-foreground text-lg font-bold sm:text-xl lg:text-[21px]">
                    AI-Powered Interview
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Practice with realistic scenarios
                  </p>
                </div>
              </div>
            </Card>

            {/* Ready to Begin Card */}
            <Card className="border-border/10 bg-card/70 relative h-[500px] overflow-hidden rounded-2xl backdrop-blur-sm sm:h-[550px] lg:h-[627px] lg:rounded-3xl">
              {/* Bottom Status Bar */}
              <div className="border-border/5 bg-card/60 absolute right-0 bottom-0 left-0 rounded-b-2xl border-t px-6 py-6 backdrop-blur-sm lg:rounded-b-3xl lg:px-7 lg:py-7">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-primary/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 lg:h-[61px] lg:w-[61px]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-foreground"
                      />
                    </svg>
                  </div>
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Ready to begin
                  </span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="bg-background/40 absolute inset-0">
                <div className="from-primary/10 absolute inset-0 bg-gradient-to-br to-transparent" />

                {/* AI Interviewer Badge */}
                <div className="bg-background/60 absolute top-4 left-4 flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-sm sm:top-5 sm:left-5 lg:gap-2.5 lg:px-3.5">
                  <div className="bg-destructive h-2 w-2 rounded-full lg:h-2.5 lg:w-2.5" />
                  <span className="text-foreground text-sm sm:text-base">
                    AI Interviewer
                  </span>
                </div>

                {/* Center Content - Interview Placeholder */}
                <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 px-4 sm:gap-10 lg:gap-12">
                  <div className="border-primary/30 bg-primary/20 flex h-20 w-20 items-center justify-center rounded-full border sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    <svg
                      width="57"
                      height="57"
                      viewBox="0 0 57 57"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                    >
                      <path
                        d="M28.5 14L14 28.5L28.5 43"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12">
                    <h2 className="text-foreground text-center text-2xl font-bold sm:text-3xl lg:text-[28px]">
                      AI Mock Interview
                    </h2>
                    <p className="text-muted-foreground text-center text-base sm:text-lg">
                      Ready to start your practice session
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 h-14 w-full max-w-xs rounded-2xl text-base font-bold shadow-lg sm:h-16 sm:text-lg lg:h-[70px] lg:max-w-sm lg:text-[21px]">
                      <svg
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      >
                        <path
                          d="M10 7L20 14.5L10 22V7Z"
                          stroke="currentColor"
                          strokeWidth="2.35"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Start Interview
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Session Overview */}
          <div className="w-full lg:w-80 xl:w-96">
            <Card className="border-primary/30 bg-primary/30 rounded-2xl px-6 pt-6 pb-1 backdrop-blur-sm lg:rounded-3xl">
              <h3 className="text-foreground mb-10 text-lg font-bold sm:mb-12 sm:text-xl lg:mb-14">
                Session Overview
              </h3>

              <div className="flex flex-col gap-4">
                <div className="border-border/20 flex items-center justify-between border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Total Questions
                  </span>
                  <span className="text-foreground text-base font-bold sm:text-lg">
                    5
                  </span>
                </div>

                <div className="border-border/20 flex items-center justify-between border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Completed
                  </span>
                  <span className="text-primary text-base font-bold sm:text-lg">
                    0
                  </span>
                </div>

                <div className="border-border/20 flex items-center justify-between border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Remaining
                  </span>
                  <span className="text-primary text-base font-bold sm:text-lg">
                    5
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Time Left
                  </span>
                  <span className="text-foreground text-base font-bold sm:text-lg">
                    3:00
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
