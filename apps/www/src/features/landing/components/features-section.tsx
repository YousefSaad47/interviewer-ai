import Image from "next/image";

import { Brain, Sparkles } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Paragraph } from "@/shared/ui/paragraph";
import { SubHeading } from "@/shared/ui/sub-heading";

export function FeaturesSection() {
  return (
    <section
      className="relative border-t border-white/[0.02] bg-gradient-to-b from-[#060814] to-[#0a0e1c] px-4 py-8 md:px-8 md:py-12"
      style={{ paddingTop: "clamp(40px, 8vw, 90px)" }}
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header - Exact Figma specs */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground text-sm">
              Comprehensive Platform
            </span>
          </div>

          <SubHeading
            as="h2"
            className="mb-2.5 text-center text-2xl md:text-3xl lg:text-4xl"
          >
            Everything You Need to{" "}
            <span className="font-bold text-foreground">Succeed</span>
          </SubHeading>

          <Paragraph className="mx-auto max-w-3xl text-center text-sm md:text-base lg:text-[21px]">
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
          <div className="relative order-2 px-6 md:px-8 lg:order-1 lg:px-0">
            <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-8 lg:size-10" />
                  <h3
                    className="text-foreground text-lg md:text-2xl lg:text-[34.1px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 600,
                      fontFamily: "Geist",
                    }}
                  >
                    Ai mock Interviews
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 md:px-6 md:py-1"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1.27em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-foreground text-xs md:text-[13px]">
                      Ai Powered
                    </span>
                  </div>
                </div>
                <SubHeading
                  as="p"
                  className="font-normal text-sm leading-[1.43em] md:text-base lg:text-[18.69px]"
                >
                  Practice with our advanced AI interviewer
                </SubHeading>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-sm leading-[1.7em] md:text-base lg:text-[22.21px]">
                Experience realistic interview scenarios with our AI that adapts
                to your responses, provides real-time feedback, and helps you
                improve your confidence and technical skills.
              </Paragraph>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 md:gap-[24.16px]">
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[17px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Data Structure
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[15px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Algorithims
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[18px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Behavioral
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[25px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.29em] md:text-sm">
                  System Design
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-5 py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Java Script
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="order-1 mx-auto my-2 w-full max-w-60 lg:order-2 lg:my-0 lg:max-w-none">
            <div className="relative aspect-405/443 w-full overflow-hidden rounded-lg lg:rounded-none animate-float-slow">
              <Image
                src="/images/ai-interview-preview-36af0e.png"
                alt="AI Mock Interview Interface"
                width={405}
                height={443}
                className="h-full w-full object-contain lg:object-cover"
              />
            </div>
          </div>
        </div>

        {/* Coding Practice */}
        <div
          className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-48"
          style={{ marginBottom: "clamp(80px, 15vw, 142px)" }}
        >
          {/* Left side - Image */}
          <div className="mx-auto my-2 w-full max-w-60 lg:my-0 lg:max-w-none">
            <div className="relative aspect-457/297 w-full overflow-hidden rounded-lg lg:rounded-none animate-float-delayed">
              <Image
                src="/images/coding-practice-preview-16338e.png"
                alt="Coding Practice Interface"
                width={457}
                height={297}
                className="h-full w-full object-contain lg:object-cover"
              />
            </div>
          </div>

          <div className="relative px-6 md:px-8 lg:px-0">
            <div className="space-y-4 md:space-y-6 lg:space-y-[37.12px]">
              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-7" />
                  <h3
                    className="text-foreground text-lg md:text-2xl lg:text-[32.06px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 600,
                      fontFamily: "Geist",
                    }}
                  >
                    Coding Practice
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 md:px-6 md:py-1"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-foreground text-xs md:text-[13px]">
                      Interactive
                    </span>
                  </div>
                </div>
                <SubHeading
                  as="p"
                  className="font-normal text-sm leading-[1.43em] md:text-base lg:text-[17.58px]"
                >
                  Solve problems with AI interviewer mode
                </SubHeading>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-sm leading-[1.31em] md:text-base lg:text-[22.12px]">
                Practice coding problems with real-time execution and optional
                AI interviewer mode for guided feedback, hints, and code quality
                assessment.
              </Paragraph>

              {/* Difficulty Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-[53.98px]">
                {[
                  { difficulty: "Easy", count: "20" },
                  { difficulty: "Medium", count: "18" },
                  { difficulty: "Hard", count: "7" },
                ].map((item) => (
                  <div
                    key={item.difficulty}
                    className="flex flex-col items-center justify-center rounded-[18.89px] border-[0.92px] border-border bg-card"
                    style={{
                      padding: "2.3px 20px",
                      gap: "4.61px",
                      minWidth: "90px",
                      width: "110.09px",
                      height: "63.57px",
                    }}
                  >
                    <div
                      className="text-2xl text-foreground sm:text-3xl"
                      style={{
                        lineHeight: "0.76em",
                        fontWeight: 700,
                        fontFamily: "Geist",
                      }}
                    >
                      {item.count}
                    </div>
                    <div
                      className="text-[10px] text-foreground sm:text-[10.95px]"
                      style={{
                        lineHeight: "0.88em",
                        fontWeight: 400,
                        fontFamily: "Geist",
                        textAlign: "center",
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
          <div className="relative order-2 px-6 md:px-8 lg:order-1 lg:px-0">
            <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
              {/* Header */}
              <div className="space-y-3 pb-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Brain className="size-6 text-primary md:size-8 lg:size-10" />
                  <h3
                    className="text-foreground text-lg md:text-2xl lg:text-[34.1px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 600,
                      fontFamily: "Geist",
                    }}
                  >
                    Resume Builder with AI
                  </h3>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 md:px-6 md:py-1"
                    style={{
                      fontSize: "11px",
                      lineHeight: "1.27em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    <span className="text-foreground text-xs md:text-[13px]">
                      Ai Powered
                    </span>
                  </div>
                </div>
                <SubHeading
                  as="p"
                  className="font-normal text-sm leading-[1.43em] md:text-base lg:text-[18.69px]"
                >
                  Create job-ready resumes with AI assistance
                </SubHeading>
              </div>

              {/* Description */}
              <Paragraph className="font-medium text-sm leading-[1.7em] md:text-base lg:text-[22.21px]">
                Create job-ready resumes with our AI that adapts to your
                experience, provides real-time suggestions, and helps you
                highlight your strengths and achievements.
              </Paragraph>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 md:gap-[24.16px]">
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[17px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Data Structure
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[15px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Algorithims
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-[18px] py-[3.5px] text-neutral-300 hover:text-white text-xs leading-[1.21em] md:text-sm">
                  Behavioral
                </Badge>
                <Badge className="rounded-full border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] transition-all duration-300 px-5 py-[3.5px] text-neutral-300 hover:text-white text-xs leading-none md:text-sm">
                  LinkedIn Profile
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="order-1 mx-auto my-2 w-full max-w-60 lg:order-2 lg:my-0 lg:max-w-none">
            <div className="relative aspect-405/443 w-full overflow-hidden rounded-lg lg:rounded-none animate-float-slow">
              <Image
                src="/images/resume-builder-preview-36af0e.png"
                alt="Resume Builder Interface"
                width={405}
                height={443}
                className="h-full w-full object-contain lg:object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
