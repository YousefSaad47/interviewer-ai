"use client";

import React from "react";

import {
  CheckCircle2,
  Download,
  Mic,
  Pause,
  Phone,
  Save,
  Settings,
  Sparkles,
  Terminal,
  Volume2,
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
  return (
    <BrowserFrame title="interviewer.ai/interview/active">
      {/* Custom Styles for Voice Orb and Waves */}
      <style>{`
        @keyframes orbPulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes waveExpand {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* Viewport Frame */}
      <div className="relative mx-auto flex max-w-2xl flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100 bg-slate-50 p-4 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#0D151A]">
        {/* Top Viewport Header */}
        <div className="z-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-bold font-sans text-[9px] text-slate-700 uppercase tracking-wider dark:text-[#EEF4F1]">
              Voice Session Active
            </span>
          </div>

          <div className="rounded-md border border-emerald-100 bg-white px-2 py-0.5 font-mono font-semibold text-[8px] text-emerald-600 dark:border-white/[0.04] dark:bg-[#142027] dark:text-[#34D399]">
            AI Interviewer Connected
          </div>
        </div>

        {/* Viewport Content - Premium Voice Call UI */}
        <div className="relative my-4 flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white/50 p-6 dark:border-white/[0.04] dark:bg-black/20">
          {/* Subtle grid background for the voice visualizer */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Central AI Glowing Orb / Visualizer */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center space-y-4">
            {/* Pulsing Orb and Wave Rings */}
            <div className="relative flex items-center justify-center">
              {/* Outer Wave 2 */}
              <div
                className="absolute h-24 w-24 rounded-full border border-emerald-400/20 dark:border-emerald-500/10"
                style={{
                  animation: "waveExpand 3s infinite linear",
                  animationDelay: "1.5s",
                }}
              />
              {/* Outer Wave 1 */}
              <div
                className="absolute h-24 w-24 rounded-full border border-emerald-400/30 dark:border-emerald-500/20"
                style={{ animation: "waveExpand 3s infinite linear" }}
              />
              {/* Outer Glow Ring */}
              <div className="absolute h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 blur-md dark:from-emerald-500/15 dark:to-teal-500/15" />

              {/* Inner Core Orb */}
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#2DD4BF] shadow-[0_0_25px_rgba(52,211,153,0.35)]"
                style={{ animation: "orbPulse 2s infinite ease-in-out" }}
              >
                <Mic className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* AI Status */}
            <div className="text-center">
              <div className="font-bold font-sans text-[11px] text-slate-800 dark:text-[#EEF4F1]">
                AI Interviewer (Speaking)
              </div>
              <div className="mt-0.5 font-mono text-[9px] text-slate-400 dark:text-[#73827D]">
                Analyzing communication pace...
              </div>
            </div>
          </div>

          {/* Live Audio Transcript Subtitles Overlay */}
          <div className="relative z-10 mt-auto w-full max-w-md rounded-lg border border-emerald-100/50 bg-white/95 p-2.5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#142027]/90">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#2DD4BF]" />
              <p className="font-bold font-sans text-[8px] text-slate-400 uppercase tracking-wider dark:text-[#73827D]">
                Real-time Transcription
              </p>
            </div>
            <p className="mt-1 font-sans text-[9.5px] text-slate-700 leading-normal dark:text-[#EEF4F1]">
              "Can you explain the difference between a process and a thread,
              and how they share memory in a multi-threaded system?"
            </p>
          </div>

          {/* Mini Waveform showing user's live audio level */}
          <div className="absolute right-4 bottom-2 flex h-6 items-end gap-0.5 opacity-60">
            {[10, 24, 15, 32, 22, 40, 18, 12, 8].map((val, idx) => (
              <div
                key={idx}
                className="w-0.5 rounded-full bg-emerald-400 dark:bg-[#34D399]"
                style={{
                  height: `${val}px`,
                  animation: `waveformPulse ${0.8 + (idx % 2) * 0.4}s ease-in-out infinite alternate`,
                  animationDelay: `${idx * 0.05}s`,
                }}
              />
            ))}
          </div>
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
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10" />
            <span className="font-mono text-[8px] text-slate-400 dark:text-[#73827D]">
              02:45 / 15:00
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-slate-400 dark:text-[#73827D]" />
            <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-[#142027]">
              <div className="h-full bg-emerald-400" style={{ width: "70%" }} />
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Phone className="h-2.5 w-2.5 rotate-[135deg]" />
              Leave
            </button>
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
    <BrowserFrame title="interviewer.ai/resume-builder">
      {/* Top Action Control Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-emerald-100 border-b pb-2 dark:border-[rgba(110,231,183,0.12)]">
        <div className="flex items-center gap-1.5 font-sans">
          <div className="flex items-center gap-1 rounded border border-emerald-100 bg-white px-2 py-0.5 text-[9px] text-slate-600 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-[#C0CBC7]">
            <Sparkles className="h-3 w-3 text-[#34D399]" /> AI Assistant
          </div>
          <div className="flex items-center gap-1 rounded border border-emerald-100 bg-white px-2 py-0.5 text-[9px] text-slate-600 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#193039] dark:text-[#C0CBC7]">
            <Save className="h-3 w-3 text-[#C0CBC7]" /> Save Draft
          </div>
          <div className="flex items-center gap-1 rounded bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#2DD4BF] px-2 py-0.5 font-semibold text-[9px] text-white shadow-[0_4px_10px_rgba(52,211,153,0.2)]">
            <Download className="h-3 w-3" /> Export PDF
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Side: Resume Builder Form Editor */}
        <div className="flex flex-col rounded-xl border border-emerald-100 bg-slate-50 p-3 text-left lg:col-span-5 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#152229]">
          <div className="mb-2 border-emerald-100 border-b pb-1 dark:border-[rgba(110,231,183,0.12)]">
            <span className="font-bold text-[9px] text-slate-500 uppercase tracking-wider dark:text-neutral-400">
              Resume Editor
            </span>
          </div>

          {/* Tab buttons */}
          <div className="mb-3 flex flex-wrap gap-1 border-slate-200 border-b pb-1.5 dark:border-white/[0.04]">
            {["Personal", "Experience", "Projects", "Skills", "Education"].map(
              (tab, idx) => (
                <span
                  key={tab}
                  className={`rounded px-1.5 py-0.5 font-sans font-semibold text-[8px] ${
                    idx === 1
                      ? "bg-[#34D399] text-[#080B0F]"
                      : "border border-slate-100 bg-white text-slate-500 dark:border-white/[0.02] dark:bg-[#142027] dark:text-[#ACBAB5]"
                  }`}
                >
                  {tab}
                </span>
              ),
            )}
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-2.5">
            <div className="space-y-0.5">
              <label
                htmlFor="mock-job-position"
                className="block font-bold text-[8px] text-slate-500 uppercase tracking-wider dark:text-[#ACBAB5]"
              >
                Job Position
              </label>
              <input
                id="mock-job-position"
                type="text"
                disabled
                value="Senior Software Engineer"
                className="w-full rounded border border-emerald-100 bg-white px-2 py-1 font-sans text-[10px] text-slate-800 dark:border-white/[0.04] dark:bg-[#121E24] dark:text-[#EEF4F1]"
              />
            </div>

            <div className="space-y-0.5">
              <label
                htmlFor="mock-company-org"
                className="block font-bold text-[8px] text-slate-500 uppercase tracking-wider dark:text-[#ACBAB5]"
              >
                Company / Organization
              </label>
              <input
                id="mock-company-org"
                type="text"
                disabled
                value="Tech Corp"
                className="w-full rounded border border-emerald-100 bg-white px-2 py-1 font-sans text-[10px] text-slate-800 dark:border-white/[0.04] dark:bg-[#121E24] dark:text-[#EEF4F1]"
              />
            </div>

            <div className="space-y-0.5">
              <label
                htmlFor="mock-desc-bullets"
                className="block font-bold text-[8px] text-slate-500 uppercase tracking-wider dark:text-[#ACBAB5]"
              >
                Description / Bullet Points
              </label>
              <textarea
                id="mock-desc-bullets"
                disabled
                value="Lead development of React microservices and optimized web performance."
                rows={2}
                className="w-full resize-none rounded border border-emerald-100 bg-white px-2 py-1 font-sans text-[10px] text-slate-800 dark:border-white/[0.04] dark:bg-[#121E24] dark:text-[#EEF4F1]"
              />
            </div>

            {/* AI Assistant Suggestion Widget */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-[#34D399]" />
                <span className="font-bold font-sans text-[8px] text-emerald-800 dark:text-[#34D399]">
                  AI Writing Assistant
                </span>
              </div>
              <p className="mt-1 font-sans text-[8.5px] text-slate-600 leading-normal dark:text-[#ACBAB5]">
                "Make it more action-oriented: 'Spearheaded frontend
                microservices architecture in React, boosting page
                responsiveness by 35%.'"
              </p>
              <div className="mt-1.5">
                <span className="rounded bg-[#34D399] px-1.5 py-0.5 font-bold font-sans text-[#080B0F] text-[7.5px]">
                  Apply Suggestion
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Resume A4 Preview Sheet */}
        <div className="flex flex-col rounded-xl border border-emerald-100 bg-slate-100 p-3 lg:col-span-7 dark:border-[rgba(110,231,183,0.12)] dark:bg-[#121E24]">
          <div className="mb-1 text-left">
            <span className="font-bold text-[9px] text-slate-500 uppercase tracking-wider dark:text-neutral-400">
              Live Preview (A4 Page)
            </span>
          </div>

          {/* Printable Page Simulation */}
          <div className="flex-1 rounded border border-slate-200/50 bg-white p-4 text-left font-serif text-black shadow-md">
            {/* Header */}
            <div className="mb-2 text-center">
              <h4
                className="font-bold text-[11px] text-black leading-none tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Alex Johnson
              </h4>
              <p className="mt-1 font-sans text-[5.5px] text-gray-500 tracking-wide">
                alex.johnson@email.com • +1 (555) 123-4567 • San Francisco, CA
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-2.5 text-[6.5px] text-gray-800 leading-normal">
              {/* Summary */}
              <div>
                <h5 className="font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Professional Summary
                </h5>
                <hr className="mt-0.5 mb-0.5 border-gray-300 border-t" />
                <p className="text-[6.5px] text-gray-700 leading-normal">
                  Senior Software Engineer with 5+ years of experience
                  specializing in building highly scalable, responsive React web
                  applications and microservices.
                </p>
              </div>

              {/* Experience */}
              <div>
                <h5 className="font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Work Experience
                </h5>
                <hr className="mt-0.5 mb-0.5 border-gray-300 border-t" />

                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between font-bold text-[6.5px] text-black">
                      <span>Senior Software Engineer</span>
                      <span className="font-normal text-[5.5px] text-gray-500">
                        2022 - Present
                      </span>
                    </div>
                    <p className="text-[6px] text-gray-600 italic">Tech Corp</p>
                    <ul className="mt-0.5 list-disc space-y-0.5 pl-3 text-[6px] text-gray-700">
                      <li>
                        Spearheaded frontend microservices architecture in
                        React, boosting page responsiveness by 35%.
                      </li>
                      <li>
                        Collaborated with product teams to align engineering
                        goals with business objectives.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h5 className="font-bold text-[6.5px] text-black uppercase tracking-wider">
                  Technical Skills
                </h5>
                <hr className="mt-0.5 mb-0.5 border-gray-300 border-t" />
                <p className="text-[6.5px] text-gray-700">
                  <strong className="font-semibold text-black">
                    Languages & Frameworks:
                  </strong>{" "}
                  React, TypeScript, Node.js, Next.js, Python, Tailwind CSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
