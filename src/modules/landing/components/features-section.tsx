import Image from "next/image";

import { Brain } from "lucide-react";

import { GridBackground } from "@/shared/components/backgrounds/grid-background";
import { Badge } from "@/shared/components/ui/badge";

export function FeaturesSection() {
  return (
    <section
      className="bg-background relative px-4 py-16 md:px-8 md:py-24"
      style={{ paddingTop: "clamp(100px, 20vw, 232px)" }}
    >
      {/* Background effects - Exact Figma positioning */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div
          className="absolute rounded-full opacity-70"
          style={{
            top: "1207.09px",
            right: "81.72px",
            width: "600.28px",
            height: "600.28px",
            background:
              "linear-gradient(180deg, oklch(0.545 0.143 265.8) 0%, oklch(0.545 0.143 265.8 / 0) 73%)",
            filter: "blur(200px)",
          }}
        />
        <div
          className="absolute hidden rounded-full opacity-70 lg:block"
          style={{
            top: "1792px",
            left: "109px",
            width: "600.28px",
            height: "600.28px",
            background:
              "linear-gradient(180deg, oklch(0.545 0.143 265.8) 0%, oklch(0.545 0.143 265.8 / 0) 73%)",
            filter: "blur(200px)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Section Header - Exact Figma specs */}
        <div className="mb-12 text-center md:mb-16">
          <div
            className="border-primary/60 bg-card mb-7 inline-flex items-center rounded-full border-[0.94px]"
            style={{
              padding: "9.04px 19.89px",
              gap: "9.04px",
            }}
          >
            <div className="flex items-center gap-[4.52px]">
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.13 1.56L15.65 17.21"
                  stroke="currentColor"
                  strokeWidth="1.56"
                  className="text-primary/80"
                />
              </svg>
              <span
                className="text-sm text-[#85A3FF] md:text-base lg:text-[17.32px]"
                style={{
                  lineHeight: "1.5em",
                  fontWeight: 400,
                  fontFamily: "Geist",
                  textAlign: "center",
                }}
              >
                Comprehensive Platform
              </span>
            </div>
          </div>

          <h2
            className="text-foreground mb-2.5 text-lg md:text-xl lg:text-[21px]"
            style={{
              lineHeight: "1.48em",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Everything You Need to{" "}
            <span className="font-bold text-[#85A3FF]">Succeed</span>
          </h2>

          <p
            className="text-muted-foreground mx-auto max-w-3xl text-sm md:text-base lg:text-[21px]"
            style={{
              lineHeight: "1.73em",
              fontWeight: 400,
              fontFamily: "Geist",
              textAlign: "center",
            }}
          >
            A complete interview preparation platform with AI-powered tools,
            real human feedback, and realistic practice environments.
          </p>
        </div>

        {/* Feature Cards - AI Mock Interviews */}
        <div
          className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20"
          style={{ marginBottom: "clamp(80px, 15vw, 142px)" }}
        >
          {/* Left side - Content */}
          <GridBackground>
            <div className="relative order-2 px-6 md:px-8 lg:order-1 lg:px-0">
              <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
                {/* Header */}
                <div className="space-y-3 pb-4 md:pb-6 lg:pb-[37.35px]">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Brain className="text-primary size-6 md:size-8 lg:size-10" />
                    <h3
                      className="text-primary text-lg md:text-2xl lg:text-[34.1px]"
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
                      className="bg-primary/70 inline-flex items-center justify-center rounded-full px-3 py-1 md:px-6 md:py-1"
                      style={{
                        fontSize: "11px",
                        lineHeight: "1.27em",
                        fontWeight: 400,
                        fontFamily: "Geist",
                      }}
                    >
                      <span className="text-primary-foreground text-xs md:text-[13px]">
                        Ai Powered
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-foreground text-sm md:text-base lg:text-[18.69px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    Practice with our advanced AI interviewer
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-foreground text-sm md:text-base lg:text-[22.21px]"
                  style={{
                    lineHeight: "1.7em",
                    fontWeight: 500,
                    fontFamily: "Geist",
                  }}
                >
                  Experience realistic interview scenarios with our AI that
                  adapts to your responses, provides real-time feedback, and
                  helps you improve your confidence and technical skills.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 md:gap-[24.16px]">
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 17px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Data Structure
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 15px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Algorithims
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 18px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Behavioral
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 25px",
                      lineHeight: "1.29em",
                      fontFamily: "Geist",
                    }}
                  >
                    System Design
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 20px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Java Script
                  </Badge>
                </div>
              </div>
            </div>
          </GridBackground>

          {/* Right side - Image */}
          <div className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none">
            <div className="relative aspect-[405/443] w-full overflow-hidden rounded-lg lg:rounded-none">
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
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[457/297] w-full overflow-hidden rounded-lg lg:rounded-none">
              <Image
                src="/images/coding-practice-preview-16338e.png"
                alt="Coding Practice Interface"
                width={457}
                height={297}
                className="h-full w-full object-contain lg:object-cover"
              />
            </div>
          </div>

          <GridBackground>
            <div className="relative px-6 md:px-8 lg:px-0">
              <div className="space-y-4 md:space-y-6 lg:space-y-[37.12px]">
                {/* Header */}
                <div className="space-y-3 pb-4 md:pb-8 lg:pb-[49.85px]">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Brain className="text-primary size-6 md:size-7" />
                    <h3
                      className="text-primary text-lg md:text-2xl lg:text-[32.06px]"
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
                      className="bg-primary/70 inline-flex items-center justify-center rounded-full px-3 py-1 md:px-6 md:py-1"
                      style={{
                        fontSize: "11px",
                        lineHeight: "1em",
                        fontWeight: 400,
                        fontFamily: "Geist",
                      }}
                    >
                      <span className="text-primary-foreground text-xs md:text-[13px]">
                        Interactive
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-foreground text-sm md:text-base lg:text-[17.58px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    Solve problems with AI interviewer mode
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-foreground text-sm md:text-base lg:text-[22.12px]"
                  style={{
                    lineHeight: "1.31em",
                    fontWeight: 500,
                    fontFamily: "Geist",
                  }}
                >
                  Practice coding problems with real-time execution and optional
                  AI interviewer mode for guided feedback, hints, and code
                  quality assessment.
                </p>

                {/* Difficulty Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-[53.98px]">
                  {[
                    { difficulty: "Easy", count: "20" },
                    { difficulty: "Medium", count: "18" },
                    { difficulty: "Hard", count: "7" },
                  ].map((item) => (
                    <div
                      key={item.difficulty}
                      className="border-primary bg-card flex flex-col items-center justify-center rounded-[18.89px] border-[0.92px]"
                      style={{
                        padding: "2.3px 20px",
                        gap: "4.61px",
                        minWidth: "90px",
                        width: "110.09px",
                        height: "63.57px",
                      }}
                    >
                      <div
                        className="text-foreground text-2xl sm:text-3xl"
                        style={{
                          lineHeight: "0.76em",
                          fontWeight: 700,
                          fontFamily: "Geist",
                        }}
                      >
                        {item.count}
                      </div>
                      <div
                        className="text-foreground text-[10px] sm:text-[10.95px]"
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
          </GridBackground>
        </div>

        {/* Resume Builder with AI */}
        <div className="mb-12 grid grid-cols-1 items-center gap-6 md:mb-20 md:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20">
          {/* Left side - Content */}
          <GridBackground>
            <div className="relative order-2 px-6 md:px-8 lg:order-1 lg:px-0">
              <div className="space-y-4 md:space-y-6 lg:space-y-7.5">
                {/* Header */}
                <div className="space-y-3 pb-4 md:pb-6 lg:pb-[37.35px]">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Brain className="text-primary size-6 md:size-8 lg:size-10" />
                    <h3
                      className="text-primary text-lg md:text-2xl lg:text-[34.1px]"
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
                      className="bg-primary/70 inline-flex items-center justify-center rounded-full px-3 py-1 md:px-6 md:py-1"
                      style={{
                        fontSize: "11px",
                        lineHeight: "1.27em",
                        fontWeight: 400,
                        fontFamily: "Geist",
                      }}
                    >
                      <span className="text-primary-foreground text-xs md:text-[13px]">
                        Ai Powered
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-foreground text-sm md:text-base lg:text-[18.69px]"
                    style={{
                      lineHeight: "1.43em",
                      fontWeight: 400,
                      fontFamily: "Geist",
                    }}
                  >
                    Create job-ready resumes with AI assistance
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-foreground text-sm md:text-base lg:text-[22.21px]"
                  style={{
                    lineHeight: "1.7em",
                    fontWeight: 500,
                    fontFamily: "Geist",
                  }}
                >
                  Create job-ready resumes with our AI that adapts to your
                  experience, provides real-time suggestions, and helps you
                  highlight your strengths and achievements.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 md:gap-[24.16px]">
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 17px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Data Structure
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 15px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Algorithims
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 18px",
                      lineHeight: "1.21em",
                      fontFamily: "Geist",
                    }}
                  >
                    Behavioral
                  </Badge>
                  <Badge
                    className="bg-primary/70 text-primary-foreground rounded-full border-none text-xs md:text-sm"
                    style={{
                      padding: "3px 20px",
                      lineHeight: "1em",
                      fontFamily: "Geist",
                    }}
                  >
                    LinkedIn Profile
                  </Badge>
                </div>
              </div>
            </div>
          </GridBackground>

          {/* Right side - Image */}
          <div className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none">
            <div className="relative aspect-[405/443] w-full overflow-hidden rounded-lg lg:rounded-none">
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
