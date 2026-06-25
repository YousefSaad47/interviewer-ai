"use client";

import React from "react";

import Image from "next/image";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Mic,
  Pause,
  Save,
  Settings,
  Terminal,
} from "lucide-react";

// A reusable premium browser frame for mockups
export function BrowserFrame({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-emerald-200 bg-white/90 font-sans shadow-[0_24px_60px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-[rgba(110,231,183,0.12)] dark:bg-[#0D151A] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.035)]">
      {/* Tab bar / Top Bar */}
      <div className="flex select-none items-center justify-between border-emerald-100 border-b bg-slate-50/95 px-4 py-3 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#121E24]">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FB7185]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#34D399]/80" />
        </div>
        {title && (
          <div className="rounded-md border border-emerald-100 bg-white px-4 py-0.5 font-mono text-[10px] text-slate-500 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229] dark:text-neutral-400">
            {title}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-neutral-500">
          <Settings className="h-3.5 w-3.5" />
        </div>
      </div>
      {/* Content */}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

export function LiveInterviewMockup() {
  const [viewMode, setViewMode] = React.useState<"camera" | "waveform">(
    "camera",
  );

  return (
    <BrowserFrame title="interviewer.ai/interview/active">
      {/* Viewport Frame */}
      <div className="relative mx-auto flex max-w-2xl flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100 bg-slate-50 p-4 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#0D151A]">
        {/* Top Viewport Header */}
        <div className="z-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="font-bold font-sans text-[9px] text-slate-700 uppercase tracking-wider dark:text-[#EEF4F1]">
              AI Interviewer
            </span>
          </div>

          {/* Mode Interactive Toggles */}
          <div className="flex rounded-md border border-emerald-100 bg-white p-0.5 dark:border-white/[0.04] dark:bg-[#142027]">
            <button
              type="button"
              onClick={() => setViewMode("camera")}
              className={`rounded px-2 py-0.5 font-semibold text-[8.5px] transition-colors ${
                viewMode === "camera"
                  ? "bg-[#34D399] text-[#080B0F]"
                  : "text-slate-500 hover:text-slate-950 dark:text-[#ACBAB5] dark:hover:text-white"
              }`}
            >
              Camera Active
            </button>
            <button
              type="button"
              onClick={() => setViewMode("waveform")}
              className={`rounded px-2 py-0.5 font-semibold text-[8.5px] transition-colors ${
                viewMode === "waveform"
                  ? "bg-[#34D399] text-[#080B0F]"
                  : "text-slate-500 hover:text-slate-950 dark:text-[#ACBAB5] dark:hover:text-white"
              }`}
            >
              Voice Pitch
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="relative my-4 flex aspect-video w-full flex-1 items-center justify-center">
          {viewMode === "camera" ? (
            <div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.04]">
              <Image
                src="/images/candidate_camera_feed.png"
                alt="Candidate Feed"
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="h-full w-full object-cover object-center opacity-90"
              />
              {/* Subdued overlay */}
              <div className="pointer-events-none absolute inset-0 bg-white/5 dark:bg-[#080B0F]/10" />
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center space-y-4 py-6">
              {/* Live Voice Pitch indicators */}
              <div className="font-mono font-semibold text-[#2DD4BF] text-[9px] uppercase tracking-widest">
                Live Voice Pitch - 120 wpm (Normal)
              </div>
              {/* Large Pitch Waveform */}
              <div className="flex h-14 w-4/5 items-end justify-between gap-1 px-2">
                {[
                  15, 30, 45, 60, 30, 75, 90, 40, 65, 80, 50, 70, 85, 35, 60,
                  75, 95, 45, 65, 80, 55, 40, 60, 30, 20,
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#34D399] to-[#2DD4BF] opacity-85 transition-all duration-300"
                    style={{
                      height: `${val}%`,
                      animation: `waveformPulse ${1.2 + (idx % 3) * 0.3}s ease-in-out infinite alternate`,
                      animationDelay: `${idx * 0.04}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="z-10 mt-4 flex items-center justify-between border-slate-200 border-t pt-3 text-[9px] text-slate-500 dark:border-white/[0.04] dark:text-[#ACBAB5]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded border border-emerald-100 bg-white p-1 text-[#059669] hover:bg-emerald-50 dark:border-white/5 dark:bg-[#142027] dark:text-[#34D399] dark:hover:bg-[#1c2d34]"
            >
              <Mic className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="rounded border border-emerald-100 bg-white p-1 text-slate-700 hover:bg-emerald-50 dark:border-white/5 dark:bg-[#142027] dark:text-white dark:hover:bg-[#1c2d34]"
            >
              <Pause className="h-3 w-3" />
            </button>
          </div>
          <div className="font-medium text-slate-500 dark:text-[#73827D]">
            Ready to begin
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

// 2. Coding Workspace Mockup Component
export function CodingWorkspaceMockup() {
  return (
    <BrowserFrame title="interviewer.ai/problems/two-sum">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Pane: Problem Description */}
        <div className="flex flex-col rounded-xl border border-emerald-100 bg-slate-50 p-4 text-left lg:col-span-5 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
          <div className="mb-3 border-emerald-100 border-b pb-2 dark:border-[rgba(110,231,183,0.12)]">
            <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider dark:text-neutral-500">
              Problem Description
            </span>
            <h4 className="mt-1 font-bold text-slate-950 text-sm dark:text-white">
              Two Sum
            </h4>
          </div>
          <div className="max-h-[160px] space-y-2 overflow-y-auto text-slate-600 text-xs leading-relaxed lg:max-h-none dark:text-[#ACBAB5]">
            <p>
              Given an array of integers{" "}
              <code className="rounded border border-emerald-100 bg-white px-1 text-slate-900 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-white">
                nums
              </code>{" "}
              and an integer{" "}
              <code className="rounded border border-emerald-100 bg-white px-1 text-slate-900 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-white">
                target
              </code>
              , return indices of the two numbers such that they add up to
              target.
            </p>
            <p>
              You may assume that each input would have exactly one solution,
              and you may not use the same element twice.
            </p>
            <div className="mt-2 rounded border border-emerald-100 bg-white p-2 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039]">
              <span className="font-bold font-mono text-[9px] text-slate-800 uppercase tracking-wider dark:text-white">
                Example:
              </span>
              <div className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-700 dark:text-[#EEF4F1]">
                <div>Input: nums = [2,7,11,15]</div>
                <div>target = 9</div>
                <div>Output: [0,1]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: IDE Editor & Tester */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* Editor Space */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-slate-50 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
            {/* Editor tab toolbar */}
            <div className="flex items-center justify-between border-emerald-100 border-b bg-white px-4 py-2 text-left dark:border-[rgba(110,231,183,0.12)] dark:bg-[#121E24]">
              <div className="flex items-center gap-2">
                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-[#047857] text-[10px] dark:border-[rgba(52,211,153,0.34)] dark:bg-[#193039] dark:text-white">
                  solution.ts
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500 dark:text-neutral-500">
                Language: TypeScript
              </span>
            </div>

            {/* Code Body */}
            <div className="overflow-x-auto p-3 text-left font-mono text-[11px] text-slate-600 leading-relaxed dark:text-[#ACBAB5]">
              <div>
                <span className="text-indigo-400">function</span>{" "}
                <span className="text-emerald-400">twoSum</span>(nums:{" "}
                <span className="text-[#67E8F9]">number[]</span>, target:{" "}
                <span className="text-[#67E8F9]">number</span>):{" "}
                <span className="text-[#67E8F9]">number[]</span>
                {" {"}
              </div>
              <div className="pl-4">
                <span className="text-indigo-400">const map</span> ={" "}
                <span className="text-indigo-400">new</span>{" "}
                <span className="text-cyan-400">Map</span>
                {"<"}
                <span className="text-[#67E8F9]">number, number</span>
                {">"}();
              </div>
              <div className="pl-4">
                <span className="text-indigo-400">for</span> (
                <span className="text-indigo-400">let</span> i ={" "}
                <span className="text-cyan-400">0</span>; i {"<"} nums.length;
                i++) {"{"}
              </div>
              <div className="pl-8">
                <span className="text-indigo-400">const</span> complement =
                target - nums[i];
              </div>
              <div className="pl-8">
                <span className="text-indigo-400">if</span>{" "}
                (map.has(complement)) {"{"}
              </div>
              <div className="pl-12 text-[#34D399]">
                <span className="text-indigo-400">return</span>{" "}
                [map.get(complement)!, i];
              </div>
              <div className="pl-8">{"}"}</div>
              <div className="pl-8">map.set(nums[i], i);</div>
              <div className="pl-4">{"}"}</div>
              <div className="pl-4 text-neutral-500">
                {"// Fallback condition"}
              </div>
              <div className="pl-4 text-[#FB7185]">
                <span className="text-indigo-400">return</span> [];
              </div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Test Case Output */}
          <div className="rounded-xl border border-emerald-100 bg-slate-50 p-3 text-left dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider dark:text-neutral-500">
                  Test Execution Console
                </span>
              </div>
              <span className="flex items-center gap-1 rounded border border-[#34D399]/20 bg-[#34D399]/15 px-2 py-0.5 font-bold text-[#34D399] text-[9px]">
                <CheckCircle2 className="h-3 w-3" /> All Tests Passed
              </span>
            </div>
            <div className="mt-1 flex gap-4 font-mono text-[10px] text-slate-600 dark:text-[#ACBAB5]">
              <div>
                <span className="text-emerald-400">✔</span> Case 1: [2,7,11,15]
                (Target 9) → Output: [0,1]
              </div>
              <div>
                <span className="text-emerald-400">✔</span> Case 2: [3,2,4]
                (Target 6) → Output: [1,2]
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

// 3. Resume Analyst Mockup Component
export function ResumeAnalystMockup() {
  return (
    <BrowserFrame title="interviewer.ai/resume-analyst">
      {/* Top Action Control Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-emerald-100 border-b pb-2 dark:border-[rgba(110,231,183,0.12)]">
        <div className="flex items-center gap-1.5 font-sans">
          <div className="flex items-center gap-1 rounded border border-emerald-100 bg-white px-2 py-0.5 text-[9px] text-slate-600 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-[#C0CBC7]">
            <Eye className="h-3 w-3 text-[#34D399]" /> ATS Checker
          </div>
          <div className="flex items-center gap-1 rounded border border-emerald-100 bg-white px-2 py-0.5 text-[9px] text-slate-600 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-[#C0CBC7]">
            <Save className="h-3 w-3 text-[#C0CBC7]" /> Save
          </div>
          <div className="flex items-center gap-1 rounded bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#2DD4BF] px-2 py-0.5 font-semibold text-[9px] text-white shadow-[0_4px_10px_rgba(52,211,153,0.2)]">
            <Download className="h-3 w-3" /> Export PDF
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Side: Mock Document Layout (Resume Preview) */}
        <div className="flex flex-col rounded-xl border border-emerald-100 bg-slate-50 p-3 text-left lg:col-span-4 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
          <div className="mb-2 flex items-center justify-between border-emerald-100 border-b pb-1.5 dark:border-[rgba(110,231,183,0.12)]">
            <span className="font-bold text-[9px] text-slate-500 uppercase tracking-wider dark:text-neutral-400">
              Resume Preview
            </span>
          </div>

          {/* Simulated Resume Sheet */}
          <div className="rounded-lg bg-[#F8FBFF] p-3 text-left font-sans text-[#081120] shadow-xl">
            <div className="mb-2 border-black/10 border-b pb-1.5 text-center">
              <h5 className="font-extrabold text-[10px] text-black leading-none tracking-tight">
                Alex Johnson
              </h5>
              <div className="mt-0.5 font-semibold text-[6px] text-black/60">
                alex.johnson@email.com | +1 (555) 123-4567 | San Francisco, CA
              </div>
            </div>
            <div className="space-y-1.5 text-[6.5px] leading-relaxed">
              <div>
                <div className="mb-0.5 border-black/5 border-b pb-0.5 font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Summary
                </div>
                <p className="text-black/75">
                  Experienced software engineer with 5+ years building scalable
                  web applications.
                </p>
              </div>
              <div>
                <div className="mb-0.5 border-black/5 border-b pb-0.5 font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Experience
                </div>
                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Senior Software Engineer</span>
                    <span className="font-normal text-[5.5px] text-black/60">
                      2022 - Present
                    </span>
                  </div>
                  <div className="text-[5.5px] text-black/65 italic">
                    Tech Corp
                  </div>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-2.5 text-black/75">
                    <li>Lead development of microservices.</li>
                  </ul>
                </div>
              </div>
              <div>
                <div className="mb-0.5 border-black/5 border-b pb-0.5 font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Education
                </div>
                <div className="flex justify-between font-bold text-black">
                  <span>B.S. Computer Science</span>
                  <span className="font-normal text-[5.5px] text-black/60">
                    2018
                  </span>
                </div>
                <div className="text-[5.5px] text-black/65 italic">
                  University of California
                </div>
              </div>
              <div>
                <div className="mb-0.5 border-black/5 border-b pb-0.5 font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Skills
                </div>
                <p className="text-black/75">
                  React • TypeScript • Node.js • Python
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: ATS Score & Recommendations */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-100 bg-slate-50 p-3 lg:col-span-8 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
          <div className="space-y-3">
            <div className="border-emerald-100 border-b pb-1.5 text-center dark:border-[rgba(110,231,183,0.12)]">
              <span className="font-bold text-[10px] text-slate-600 uppercase tracking-wider dark:text-neutral-300">
                ATS Score Analysis
              </span>
            </div>

            {/* Score circle layout */}
            <div className="flex flex-col items-center justify-center py-0.5">
              <div className="relative flex h-16 w-16 select-none items-center justify-center">
                <svg
                  className="absolute -rotate-90 transform"
                  width="64"
                  height="64"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="rgba(167,243,208,0.08)"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#34D399"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="163.3"
                    strokeDashoffset="21.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-extrabold font-mono text-slate-950 text-sm dark:text-white">
                  87%
                </span>
              </div>
              <h5 className="mt-2 font-bold text-[10px] text-slate-950 dark:text-white">
                Excellent ATS Compatibility
              </h5>
              <p className="mt-0.5 max-w-[280px] text-center text-[9px] text-slate-500 dark:text-[#ACBAB5]/85">
                Your resume is well-optimized for applicant tracking systems
              </p>
            </div>

            {/* Progress Bars for Metrics */}
            <div className="space-y-2 border-emerald-100 border-t pt-3 text-left dark:border-[rgba(110,231,183,0.12)]">
              {[
                { label: "Keyword Match", val: 80 },
                { label: "Format Compatibility", val: 40 },
                { label: "Readability", val: 80 },
                { label: "Impact Metrics", val: 80 },
              ].map((metric) => (
                <div key={metric.label} className="space-y-0.5">
                  <div className="flex justify-between font-medium text-[8px]">
                    <span className="text-slate-500 dark:text-[#ACBAB5]">
                      {metric.label}
                    </span>
                    <span className="font-mono text-slate-800 dark:text-white">
                      {metric.val}%
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-200 dark:border-white/[0.02] dark:bg-[#193039]">
                    <div
                      className="h-full rounded-full bg-[#34D399]"
                      style={{ width: `${metric.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Recommendations */}
            <div className="border-emerald-100 border-t pt-3 text-left dark:border-[rgba(110,231,183,0.12)]">
              <h6 className="mb-2 font-bold text-[9px] text-slate-800 uppercase tracking-wider dark:text-white">
                AI Recommendations
              </h6>
              <div className="space-y-1.5">
                {/* Recommendation 1 */}
                <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white p-2 dark:border-[rgba(167,243,208,0.08)] dark:bg-[#193039]/40">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2DD4BF]" />
                  <div>
                    <div className="font-bold text-[9px] text-slate-800 dark:text-white">
                      Strong Technical Keywords
                    </div>
                    <div className="mt-0.5 text-[8px] text-slate-500 dark:text-[#ACBAB5]/85">
                      Your resume includes key technologies like React and AWS
                    </div>
                  </div>
                </div>
                {/* Recommendation 2 */}
                <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white p-2 dark:border-[rgba(167,243,208,0.08)] dark:bg-[#193039]/40">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <div>
                    <div className="font-bold text-[9px] text-slate-800 dark:text-white">
                      Add More Metrics
                    </div>
                    <div className="mt-0.5 text-[8px] text-slate-500 dark:text-[#ACBAB5]/85">
                      Include quantifiable achievements (e.g., "Increased
                      conversion by 25%")
                    </div>
                  </div>
                </div>
                {/* Recommendation 3 */}
                <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white p-2 dark:border-[rgba(167,243,208,0.08)] dark:bg-[#193039]/40">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2DD4BF]" />
                  <div>
                    <div className="font-bold text-[9px] text-slate-800 dark:text-white">
                      Good Format
                    </div>
                    <div className="mt-0.5 text-[8px] text-slate-500 dark:text-[#ACBAB5]/85">
                      Clean structure with clear sections and bullet points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
