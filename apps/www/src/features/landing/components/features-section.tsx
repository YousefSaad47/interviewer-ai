import { Brain, Sparkles } from "lucide-react";

import { Badge, Paragraph, SubHeading } from "@/shared/ui";

import {
  CodingWorkspaceMockup,
  LiveInterviewMockup,
  ResumeAnalystMockup,
} from "./product-mockups";

export function FeaturesSection() {
  return (
    <section
      className="relative border-slate-200/70 border-t bg-gradient-to-b from-[#F6F9FF] to-[#EEF7F4] px-4 py-8 md:px-8 md:py-12 dark:border-white/[0.02] dark:from-[#0A0F13] dark:to-[#0C1216]"
      style={{ paddingTop: "clamp(40px, 8vw, 90px)" }}
    >
      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Section Header - Exact Figma specs */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 shadow-emerald-900/5 shadow-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/60">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium text-slate-700 text-sm dark:text-[#EEF4F1]">
              Comprehensive Platform
            </span>
          </div>

          <SubHeading
            as="h2"
            className="mb-2.5 text-center text-2xl md:text-3xl lg:text-4xl"
          >
            Everything You Need to{" "}
            <span className="font-bold text-primary">Succeed</span>
          </SubHeading>

          <Paragraph className="mx-auto max-w-3xl text-center text-slate-600 text-sm md:text-base lg:text-[21px] dark:text-[#ACBAB5]">
            A complete interview preparation platform with AI-powered tools,
            real human feedback, and realistic practice environments.
          </Paragraph>
        </div>

        {/* Feature Cards - AI Mock Interviews */}
        <div
          className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20"
          style={{ marginBottom: "clamp(80px, 15vw, 142px)" }}
        >
          {/* Left side - Content */}
          <div className="group/text relative order-2 border-emerald-200 border-l-2 px-6 py-2 pl-6 transition-all duration-300 hover:border-[#34D399]/50 md:px-8 md:pl-8 lg:order-1 lg:px-0 dark:border-[rgba(167,243,208,0.06)] dark:hover:border-[#34D399]/40">
            <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
              {/* Eyebrow Tag */}
              <div className="inline-flex w-fit select-none items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 font-mono font-semibold text-[#059669] text-[10px] tracking-wider dark:border-[rgba(167,243,208,0.08)] dark:bg-white/[0.02] dark:text-[#34D399]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399]" />
                SIMULATION ENGINE
              </div>

              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-8 lg:size-10" />
                  <h3
                    className="text-2xl text-slate-950 tracking-tight md:text-3xl lg:text-[34px] dark:text-[#EEF4F1]"
                    style={{
                      lineHeight: "1.2em",
                      fontWeight: 700,
                      fontFamily: "Geist",
                    }}
                  >
                    Ai mock{" "}
                    <span className="font-bold text-gradient-primary">
                      Interviews
                    </span>
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-3 py-1 shadow-sm md:px-6 md:py-1 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1.27em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-slate-700 text-xs md:text-[13px] dark:text-[#EEF4F1]">
                      Ai Powered
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-slate-700 text-sm md:text-base lg:text-[18px] dark:text-white/90">
                  Practice with our advanced AI interviewer
                </p>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-[15px] text-slate-600 leading-relaxed dark:text-[#ACBAB5]">
                Experience realistic interview scenarios with our AI that adapts
                to your responses, provides real-time feedback, and helps you
                improve your confidence and technical skills.
              </Paragraph>

              {/* Sub-features Grid */}
              <div className="grid grid-cols-2 gap-4 border-slate-200 border-t pt-4 dark:border-white/[0.04]">
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                    Adaptive AI
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Questions dynamically branch and adapt based on your
                    answers.
                  </p>
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                    Real-time Insight
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Get instant correction on delivery pace, key terms, and
                    tone.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[14px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Data Structure
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[12px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Algorithims
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[14px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Behavioral
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[18px] py-[3px] text-slate-600 text-xs leading-[1.29em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  System Design
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[15px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Java Script
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Code-Built Mockup */}
          <div className="order-1 mx-auto my-2 w-full lg:order-2 lg:my-0 lg:max-w-none">
            <div className="w-full">
              <LiveInterviewMockup />
            </div>
          </div>
        </div>

        {/* Coding Practice */}
        <div
          className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20"
          style={{ marginBottom: "clamp(80px, 15vw, 142px)" }}
        >
          {/* Left side - Code-Built Mockup */}
          <div className="mx-auto my-2 w-full lg:my-0 lg:max-w-none">
            <div className="w-full">
              <CodingWorkspaceMockup />
            </div>
          </div>

          <div className="group/text relative border-emerald-200 border-l-2 px-6 py-2 pl-6 transition-all duration-300 hover:border-[#34D399]/50 md:px-8 md:pl-8 lg:px-0 dark:border-[rgba(167,243,208,0.06)] dark:hover:border-[#34D399]/40">
            <div className="space-y-4 md:space-y-6 lg:space-y-[37.12px]">
              {/* Eyebrow Tag */}
              <div className="inline-flex w-fit select-none items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 font-mono font-semibold text-[#059669] text-[10px] tracking-wider dark:border-[rgba(167,243,208,0.08)] dark:bg-white/[0.02] dark:text-[#34D399]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399]" />
                SANDBOX RUNTIME
              </div>

              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-7" />
                  <h3
                    className="text-2xl text-slate-950 tracking-tight md:text-3xl lg:text-[34px] dark:text-[#EEF4F1]"
                    style={{
                      lineHeight: "1.2em",
                      fontWeight: 700,
                      fontFamily: "Geist",
                    }}
                  >
                    Coding{" "}
                    <span className="font-bold text-gradient-primary">
                      Practice
                    </span>
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-3 py-1 shadow-sm md:px-6 md:py-1 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-slate-700 text-xs md:text-[13px] dark:text-[#EEF4F1]">
                      Interactive
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-slate-700 text-sm md:text-base lg:text-[18px] dark:text-white/90">
                  Solve problems with AI interviewer mode
                </p>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-[15px] text-slate-600 leading-relaxed dark:text-[#ACBAB5]">
                Practice coding problems with real-time execution and optional
                AI interviewer mode for guided feedback, hints, and automated
                code quality assessment.
              </Paragraph>

              {/* Sub-features Grid */}
              <div className="grid grid-cols-2 gap-4 border-slate-200 border-t pt-4 dark:border-white/[0.04]">
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                    Live Compiler
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Write, compile, and run code instantly in our secure
                    sandbox.
                  </p>
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                    AI Code Reviews
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Receive direct insights on space, time complexity, and clean
                    code.
                  </p>
                </div>
              </div>

              {/* Difficulty Stats */}
              <div className="flex flex-wrap gap-4 pt-2 sm:gap-6 md:gap-[24px]">
                {[
                  { difficulty: "Easy", count: "20" },
                  { difficulty: "Medium", count: "18" },
                  { difficulty: "Hard", count: "7" },
                ].map((item) => (
                  <div
                    key={item.difficulty}
                    className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white/70 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50/80 dark:border-[rgba(167,243,208,0.08)] dark:bg-[#142027]/25 dark:hover:bg-[#142027]/50"
                    style={{
                      padding: "2px 16px",
                      gap: "2px",
                      minWidth: "90px",
                      width: "100px",
                      height: "56px",
                    }}
                  >
                    <div
                      className="font-extrabold text-slate-950 text-xl sm:text-2xl dark:text-[#EEF4F1]"
                      style={{
                        lineHeight: "0.8em",
                        fontFamily: "Geist",
                      }}
                    >
                      {item.count}
                    </div>
                    <div
                      className="text-center font-semibold text-[9px] text-slate-500 uppercase tracking-wider dark:text-[#ACBAB5]"
                      style={{
                        lineHeight: "1em",
                        fontFamily: "Geist",
                      }}
                    >
                      {item.difficulty}
                    </div>
                  </div>
                ))}{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Builder with AI */}
        <div className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20">
          {/* Left side - Content */}
          <div className="group/text relative order-2 border-emerald-200 border-l-2 px-6 py-2 pl-6 transition-all duration-300 hover:border-[#34D399]/50 md:px-8 md:pl-8 lg:order-1 lg:px-0 dark:border-[rgba(167,243,208,0.06)] dark:hover:border-[#34D399]/40">
            <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
              {/* Eyebrow Tag */}
              <div className="inline-flex w-fit select-none items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 font-mono font-semibold text-[#059669] text-[10px] tracking-wider dark:border-[rgba(167,243,208,0.08)] dark:bg-white/[0.02] dark:text-[#34D399]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399]" />
                ATS OPTIMIZER
              </div>

              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-8 lg:size-10" />
                  <h3
                    className="text-2xl text-slate-950 tracking-tight md:text-3xl lg:text-[34px] dark:text-[#EEF4F1]"
                    style={{
                      lineHeight: "1.2em",
                      fontWeight: 700,
                      fontFamily: "Geist",
                    }}
                  >
                    Resume{" "}
                    <span className="font-bold text-gradient-primary">
                      Builder
                    </span>{" "}
                    with AI
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-3 py-1 shadow-sm md:px-6 md:py-1 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1.27em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-slate-700 text-xs md:text-[13px] dark:text-[#EEF4F1]">
                      Ai Powered
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-slate-700 text-sm md:text-base lg:text-[18px] dark:text-white/90">
                  Create job-ready resumes with AI assistance
                </p>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-[15px] text-slate-600 leading-relaxed dark:text-[#ACBAB5]">
                Create job-ready resumes with our AI that adapts to your
                experience, provides real-time suggestions, and helps you
                highlight your strengths and achievements.
              </Paragraph>

              {/* Sub-features Grid */}
              <div className="grid grid-cols-2 gap-4 border-slate-200 border-t pt-4 dark:border-white/[0.04]">
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                    ATS Filters
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Ensure keyword matches and structure compatibility with ATS
                    screening systems.
                  </p>
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs dark:text-[#EEF4F1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                    Smart Suggestions
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal dark:text-[#73827D]">
                    Receive context-aware adjustments to improve impact and
                    phrasing.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[14px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Data Structure
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[12px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Algorithims
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-[14px] py-[3px] text-slate-600 text-xs leading-[1.21em] transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  Behavioral
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-white/70 px-5 py-[3px] text-slate-600 text-xs leading-none transition-all duration-300 hover:border-primary/30 hover:bg-emerald-50 hover:text-slate-950 md:text-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/30 dark:text-[#ACBAB5] dark:hover:bg-[#34D399]/[0.04] dark:hover:text-white">
                  LinkedIn Profile
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Code-Built Mockup */}
          <div className="order-1 mx-auto my-2 w-full lg:order-2 lg:my-0 lg:max-w-none">
            <div className="w-full">
              <ResumeAnalystMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
