"use client";

import { Heading } from "@/shared/ui/heading";
import { Paragraph } from "@/shared/ui/paragraph";
import { SpotlightCard } from "@/shared/ui/spotlight-card";

interface FeatureCardProps {
  className?: string;
  glowPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  children: React.ReactNode;
}

export function FeatureCard({
  className = "",
  glowPosition = "top-right",
  children,
}: FeatureCardProps) {
  const glowStyles = {
    "top-left":
      "radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.08), transparent 38%)",
    "top-right":
      "radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.08), transparent 38%)",
    "bottom-left":
      "radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.08), transparent 38%)",
    "bottom-right":
      "radial-gradient(circle at 80% 80%, rgba(52, 211, 153, 0.08), transparent 38%)",
    center:
      "radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.08), transparent 45%)",
  };

  return (
    <SpotlightCard
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[rgba(167,243,208,0.12)] bg-gradient-to-b from-[#142027]/98 to-[#0C1216]/98 p-6 shadow-black/35 shadow-xl transition-all duration-350 hover:border-[rgba(52,211,153,0.32)] md:p-8 ${className}`}
      spotlightColor="rgba(52, 211, 153, 0.10)"
    >
      {/* Premium Top Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Subtle Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowStyles[glowPosition] }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {children}
      </div>
    </SpotlightCard>
  );
}

interface FeatureCardHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCardHeader({
  icon,
  title,
  description,
}: FeatureCardHeaderProps) {
  return (
    <div className="mb-6 space-y-3">
      {/* Icon Container */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(167,243,208,0.16)] bg-gradient-to-br from-[#142027] to-[#0D151A] text-[#34D399] shadow-md transition-all duration-355 group-hover:scale-105 group-hover:border-[#34D399]/40 group-hover:text-[#4ADEAA]">
        {icon}
      </div>
      <h3 className="font-bold text-[#EEF4F1] text-xl tracking-tight">
        {title}
      </h3>
      <p className="max-w-xl text-[#ACBAB5] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* 1. Voice Analysis Widget */
function VoiceAnalysisWidget() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      {/* Accent glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-24 w-24 rounded-full bg-[#2DD4BF]/10 blur-xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-24 w-24 rounded-full bg-[#34D399]/10 blur-xl" />

      {/* Top Bar */}
      <div className="mb-5 flex items-center justify-between border-white/5 border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]"></span>
          </span>
          <span className="font-mono font-semibold text-[#2DD4BF] text-[10px] uppercase tracking-wider">
            Realtime Stream
          </span>
        </div>
        <div className="font-mono text-[#73827D] text-[10px]">
          02:14 / 05:00
        </div>
      </div>

      {/* Large Waveform Visual */}
      <div className="mb-5 flex h-20 w-full items-end justify-between gap-1 px-2">
        {[
          25, 45, 60, 30, 75, 90, 40, 65, 80, 50, 70, 85, 35, 60, 75, 95, 45,
          65, 80, 55, 40, 60, 30, 20,
        ].map((val, idx) => (
          <div
            key={idx}
            className="w-1.5 rounded-full bg-gradient-to-t from-[#34D399] to-[#2DD4BF] opacity-85 transition-all duration-300"
            style={{
              height: `${val}%`,
              animation: `waveformPulse ${1 + (idx % 3) * 0.4}s ease-in-out infinite alternate`,
              animationDelay: `${idx * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 border-white/5 border-t pt-4 md:grid-cols-4">
        <div className="space-y-1 text-left">
          <span className="block text-[#73827D] text-[10px] uppercase tracking-wider">
            Pace
          </span>
          <div className="font-semibold text-[#EEF4F1] text-sm">138 WPM</div>
          <span className="text-[#22C55E] text-[9px]">Optimal</span>
        </div>
        <div className="space-y-1 text-left">
          <span className="block text-[#73827D] text-[10px] uppercase tracking-wider">
            Confidence
          </span>
          <div className="font-semibold text-[#EEF4F1] text-sm">94.2%</div>
          <span className="text-[#22C55E] text-[9px]">High</span>
        </div>
        <div className="space-y-1 text-left">
          <span className="block text-[#73827D] text-[10px] uppercase tracking-wider">
            Tone
          </span>
          <div className="font-semibold text-[#EEF4F1] text-sm">Articulate</div>
          <span className="text-[#2DD4BF] text-[9px]">Professional</span>
        </div>
        <div className="space-y-1 text-left">
          <span className="block text-[#73827D] text-[10px] uppercase tracking-wider">
            Pauses
          </span>
          <div className="font-semibold text-[#EEF4F1] text-sm">0.4 / min</div>
          <span className="text-[#22C55E] text-[9px]">-12% lower</span>
        </div>
      </div>

      {/* Emotion Chips */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-white/5 border-t pt-3">
        <span className="rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 px-2.5 py-0.5 font-medium text-[#2DD4BF] text-[10px]">
          Calm
        </span>
        <span className="rounded-full border border-[#34D399]/20 bg-[#34D399]/10 px-2.5 py-0.5 font-medium text-[#34D399] text-[10px]">
          Confident
        </span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-[10px] text-emerald-400">
          Empathetic
        </span>
      </div>
    </div>
  );
}

/* 2. ATS Resume Optimization Widget */
function ATSOptimizationWidget() {
  return (
    <div className="relative w-full space-y-4 overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl" />

      {/* File Row */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-[#34D399]/20 bg-[#34D399]/10 p-2 text-[#34D399]">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-semibold text-[#EEF4F1] text-xs">
              resume_lead_engineer.pdf
            </div>
            <div className="text-[#73827D] text-[10px]">
              Updated 2h ago • 142 KB
            </div>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-medium text-[10px] text-emerald-400">
          Ready
        </span>
      </div>

      {/* Score Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#ACBAB5]">ATS Score Match</span>
          <span className="font-semibold text-emerald-400">88%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#34D399] to-[#2DD4BF]"
            style={{
              width: "88%",
              animation: "progressGrow 1.5s ease-out forwards",
            }}
          />
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 gap-4 text-left">
        <div>
          <span className="block text-[#73827D] text-[9px] uppercase tracking-wider">
            Keyword Match
          </span>
          <div className="font-semibold text-[#EEF4F1] text-xs">
            24 / 29 Matched
          </div>
        </div>
        <div>
          <span className="block text-[#73827D] text-[9px] uppercase tracking-wider">
            Match Ratio
          </span>
          <div className="font-semibold text-[#34D399] text-xs">
            82% overall
          </div>
        </div>
      </div>

      {/* Suggested Additions */}
      <div className="space-y-1.5 text-left">
        <span className="text-[#73827D] text-[10px]">
          Suggested keywords to add:
        </span>
        <div className="flex flex-wrap gap-1">
          {["System Design", "CI/CD Pipelines", "TypeScript"].map((keyword) => (
            <span
              key={keyword}
              className="rounded border border-rose-500/10 bg-rose-500/5 px-2 py-0.5 font-mono text-[9px] text-rose-400"
            >
              + {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3. Detailed Performance Analytics Widget */
function PerformanceAnalyticsWidget() {
  return (
    <div className="relative w-full space-y-4 overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-[#34D399]/5 blur-xl" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#EEF4F1] text-xs">
          Performance Score
        </span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-medium text-[10px] text-emerald-400">
          +12% vs avg
        </span>
      </div>

      {/* Score and radial progress */}
      <div className="flex items-center gap-6">
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="absolute -rotate-90 transform" width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="url(#radialGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="213.6"
              strokeDashoffset="32"
              strokeLinecap="round"
              style={{
                animation: "dashDraw 1.5s ease-out forwards",
              }}
            />
            <defs>
              <linearGradient
                id="radialGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#2DD4BF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <span className="font-bold font-mono text-[#EEF4F1] text-lg">
              85
            </span>
            <span className="-mt-1 block text-[#73827D] text-[10px]">/100</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          <div className="space-y-1 text-left">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#ACBAB5]">Technical</span>
              <span className="font-semibold text-[#EEF4F1]">89/100</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-[#34D399]"
                style={{ width: "89%" }}
              />
            </div>
          </div>
          <div className="space-y-1 text-left">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#ACBAB5]">Communication</span>
              <span className="font-semibold text-[#EEF4F1]">82/100</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-[#2DD4BF]"
                style={{ width: "82%" }}
              />
            </div>
          </div>
          <div className="space-y-1 text-left">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#ACBAB5]">Confidence</span>
              <span className="font-semibold text-[#EEF4F1]">86/100</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: "86%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mini Trend Graph SVG */}
      <div className="border-white/5 border-t pt-3 text-left">
        <div className="mb-2 flex justify-between text-[#73827D] text-[10px]">
          <span>Weekly Progress</span>
          <span className="flex items-center gap-0.5 text-[#22C55E]">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Improved
          </span>
        </div>
        <div className="h-12 w-full">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 25 Q 15 22, 30 18 T 60 12 T 90 5 L 100 5 L 100 30 L 0 30 Z"
              fill="url(#trendGradient)"
              opacity="0.15"
            />
            <path
              d="M 0 25 Q 15 22, 30 18 T 60 12 T 90 5"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="trendGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="90" cy="5" r="2.5" fill="#34D399" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* 4. Real Human Assessments Widget */
function HumanAssessmentWidget() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#34D399]/5 blur-xl" />

      <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row">
        {/* Left Side: Avatar Stack and Reviewer Status */}
        <div className="flex flex-col justify-between space-y-4 md:w-2/5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-3">
                {[
                  { name: "Sarah J." },
                  { name: "Marcus C." },
                  { name: "Emily R." },
                ].map((avatar, idx) => (
                  <div
                    key={idx}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#11191E] bg-[#142027] font-bold text-[10px] text-white shadow-lg"
                  >
                    {avatar.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                ))}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#11191E] bg-gradient-to-br from-[#10B981] to-[#2DD4BF] font-bold font-mono text-[9px] text-white shadow-lg">
                  +150
                </div>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <span className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-medium text-[10px] text-primary">
                Verified FAANG Reviewers
              </span>
              <div className="text-[#73827D] text-[11px] leading-snug">
                Personalized feedback and grading by expert interviewers.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-white/5 border-t pt-2 text-left">
            <div>
              <span className="block text-[#73827D] text-[9px] uppercase tracking-wider">
                Avg Response
              </span>
              <span className="font-semibold text-emerald-400 text-xs">
                &lt; 2 Hours
              </span>
            </div>
            <div>
              <span className="block text-[#73827D] text-[9px] uppercase tracking-wider">
                Rating
              </span>
              <span className="font-semibold text-[#EEF4F1] text-xs">
                ★ 4.98 / 5
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Sample Feedback Preview */}
        <div className="flex flex-1 flex-col justify-between space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between border-white/5 border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
              <span className="font-mono font-semibold text-[#EEF4F1] text-[10px]">
                FEEDBACK PREVIEW
              </span>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono font-semibold text-[9px] text-emerald-400">
              Completed
            </span>
          </div>

          <p className="text-left text-[#ACBAB5] text-[11px] italic leading-relaxed">
            "Your explanation of database sharding was highly clear, but focus
            more on edge-case recovery and network partition handling when
            talking about Distributed Systems..."
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 border-white/5 border-t pt-2">
            <div className="flex gap-1.5">
              {["System Design", "Backend", "Leadership"].map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#34D399]/10 px-2 py-0.5 font-medium text-[9px] text-emerald-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="font-mono text-[#73827D] text-[10px]">
              By Sarah J. • Google
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5. Interactive Live Meetings Widget */
function LiveMeetingWidget() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      <div className="pointer-events-none absolute top-0 left-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl" />

      <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row">
        {/* Video Panel */}
        <div className="grid min-h-[140px] flex-1 grid-cols-2 gap-3">
          {/* Attendee 1 */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#142027]/60 p-3">
            <div className="pointer-events-none absolute inset-0 animate-pulse rounded-xl border-2 border-emerald-500/40" />

            <div className="z-10 flex items-start justify-between">
              <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono font-semibold text-[9px] text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                SPEAKING
              </span>
              <div className="flex gap-1 text-[10px]">
                <span className="rounded bg-black/40 p-1">🎙️</span>
                <span className="rounded bg-black/40 p-1">📹</span>
              </div>
            </div>

            <div className="z-10 mt-auto flex items-center gap-2 text-left">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 font-bold text-[9px] text-white">
                SJ
              </div>
              <div>
                <div className="font-bold text-[#EEF4F1] text-[10px] leading-tight">
                  Sarah J.
                </div>
                <div className="text-[#73827D] text-[8px]">
                  Google Interviewer
                </div>
              </div>
            </div>
          </div>

          {/* Attendee 2 */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#142027]/40 p-3">
            <div className="z-10 flex items-start justify-between">
              <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[#ACBAB5] text-[9px]">
                CANDIDATE
              </span>
              <div className="flex gap-1 text-[10px]">
                <span className="rounded bg-black/40 p-1">🎙️</span>
                <span className="rounded bg-black/40 p-1">📹</span>
              </div>
            </div>

            <div className="z-10 mt-auto flex items-center gap-2 text-left">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#1e293b] font-bold text-[9px] text-white">
                ME
              </div>
              <div>
                <div className="font-bold text-[#EEF4F1] text-[10px] leading-tight">
                  You (Candidate)
                </div>
                <div className="text-[#73827D] text-[8px]">L4 Software Eng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions panel */}
        <div className="flex flex-col justify-between py-1 text-left md:w-1/3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-white/5 border-b pb-2">
              <span className="font-mono text-[#73827D] text-[10px]">
                DURATION
              </span>
              <span className="font-bold font-mono text-[#EEF4F1] text-xs">
                18:42
              </span>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-[#EEF4F1] text-xs">
                Interactive Meeting Room
              </div>
              <p className="text-[#73827D] text-[10px] leading-normal">
                Integrated real-time workspace featuring audio, video, and
                whiteboards.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 font-semibold text-black text-xs transition-colors duration-200 hover:bg-emerald-400"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Join Live Room
          </button>
        </div>
      </div>
    </div>
  );
}

/* 6. Remote Screen Control Widget */
function RemoteControlWidget() {
  return (
    <div className="relative w-full space-y-4 overflow-hidden rounded-2xl border border-[rgba(167,243,208,0.08)] bg-gradient-to-b from-[#11191E] to-[#0B1014] p-5 shadow-2xl">
      <div className="pointer-events-none absolute right-0 bottom-0 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl" />

      {/* Screen Monitor Mockup */}
      <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080B0F] p-3">
        {/* browser top bar */}
        <div className="mb-1.5 flex items-center gap-1 border-white/5 border-b pb-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <div className="mx-auto h-2 w-1/2 rounded-sm bg-white/5" />
        </div>

        {/* Screen Code */}
        <div className="flex-1 select-none space-y-1 overflow-hidden text-left font-mono text-[#ACBAB5] text-[8px] leading-normal">
          <div className="font-semibold text-[#2DD4BF]">
            import <span className="text-[#34D399]">{"{ liveControl }"}</span>{" "}
            from "interviewer-ai";
          </div>
          <div>
            const <span className="text-yellow-400">interviewer</span> = new
            Interviewer();
          </div>
          <div>
            await interviewer.connectSession(
            <span className="text-green-400">"session_active"</span>);
          </div>
          <div className="text-[#73827D]">
            {"// Syncing state to interviewer console..."}
          </div>
        </div>

        {/* Animated Pointer */}
        <div className="pointer-events-none absolute top-1/2 left-2/3 z-20 -translate-x-1/2 -translate-y-1/2 transform animate-bounce">
          <svg
            className="h-4 w-4 fill-current text-[#2DD4BF] drop-shadow-[0_2px_8px_rgba(45,212,191,0.5)]"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Status */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded border border-white/10 bg-black/80 px-2 py-0.5 font-semibold text-[8px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live Control Enabled
        </div>
      </div>

      {/* Device Info */}
      <div className="space-y-2 text-left text-xs">
        <div className="flex items-center justify-between text-[#ACBAB5]">
          <span>Connected Device</span>
          <span className="font-semibold text-[#EEF4F1]">MacBook Pro 16"</span>
        </div>
        <div className="flex items-center justify-between text-[#ACBAB5]">
          <span>Latency & Quality</span>
          <span className="font-semibold text-emerald-400">
            18ms • Excellent
          </span>
        </div>
        <div className="flex items-center justify-between text-[#ACBAB5]">
          <span>Security Protocol</span>
          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium font-mono text-[10px] text-primary">
            AES-256 SSL
          </span>
        </div>
      </div>

      {/* Revoke Button */}
      <button
        type="button"
        className="w-full rounded border border-white/5 bg-white/5 py-1.5 font-semibold text-[#ACBAB5] text-xs transition-all duration-200 hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
      >
        Revoke Access
      </button>
    </div>
  );
}

export function AdditionalFeaturesSection() {
  return (
    <section className="relative overflow-hidden border-white/[0.02] border-t bg-[#080B0F] py-24">
      {/* Global CSS Style tag for custom animations */}
      <style>{`
        @keyframes waveformPulse {
          0% { transform: scaleY(0.7); opacity: 0.7; }
          100% { transform: scaleY(1.3); opacity: 1; }
        }
        @keyframes progressGrow {
          from { width: 0%; }
          to { width: 88%; }
        }
        @keyframes dashDraw {
          from { stroke-dashoffset: 213.6; }
          to { stroke-dashoffset: 32; }
        }
      `}</style>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <Heading
            as="h2"
            className="mb-6 font-extrabold text-3xl text-[#EEF4F1] tracking-tight md:text-4xl"
          >
            Our <span className="text-primary">Features</span>
          </Heading>
          <Paragraph className="mx-auto max-w-3xl text-[#ACBAB5] text-base md:text-lg">
            A complete interview preparation platform with AI-powered features
            designed to help you succeed
          </Paragraph>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Verbal & Emotional Analysis (colspan 2) */}
          <FeatureCard
            className="flex flex-col justify-between md:col-span-2 lg:col-span-2"
            glowPosition="top-left"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              }
              title="Verbal & Emotional Analysis"
              description="Get real-time feedback on your speaking pace, confidence levels, tone of voice, and pause frequency during AI-driven mock interviews."
            />
            <VoiceAnalysisWidget />
          </FeatureCard>

          {/* Card 2: ATS Resume Optimization (colspan 1) */}
          <FeatureCard
            className="flex flex-col justify-between md:col-span-1 lg:col-span-1"
            glowPosition="top-right"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="ATS Resume Optimization"
              description="Instantly scan and optimize your resume to pass applicant tracking systems (ATS) and match target job descriptions."
            />
            <ATSOptimizationWidget />
          </FeatureCard>

          {/* Card 3: Detailed Performance Analytics (colspan 1) */}
          <FeatureCard
            className="flex flex-col justify-between md:col-span-1 lg:col-span-1"
            glowPosition="bottom-left"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Detailed Performance Analytics"
              description="Track your progress over time with multi-dimensional rating boards covering both technical coding and soft communication skills."
            />
            <PerformanceAnalyticsWidget />
          </FeatureCard>

          {/* Card 4: Real Human Assessments (colspan 2) */}
          <FeatureCard
            className="flex flex-col justify-between md:col-span-2 lg:col-span-2"
            glowPosition="bottom-right"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="Real Human Assessments"
              description="Receive expert human feedback and personalized mock-grading sessions conducted by industry-leading professionals."
            />
            <HumanAssessmentWidget />
          </FeatureCard>

          {/* Card 5: Interactive Live Meetings (colspan 2) */}
          <FeatureCard
            className="flex flex-col justify-between md:col-span-2 lg:col-span-2"
            glowPosition="center"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Interactive Live Meetings"
              description="Join dynamic live meeting rooms with your assigned interviewer, featuring integrated collaborative screen and whiteboards."
            />
            <LiveMeetingWidget />
          </FeatureCard>

          {/* Card 6: Remote Screen Control (colspan 1) */}
          <FeatureCard
            className="col-span-1 flex flex-col justify-between md:col-span-2 lg:col-span-1"
            glowPosition="top-left"
          >
            <FeatureCardHeader
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Remote Screen Control"
              description="Enable secure, permission-controlled remote support so interviewers can interactively debug code during technical coding rounds."
            />
            <RemoteControlWidget />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
