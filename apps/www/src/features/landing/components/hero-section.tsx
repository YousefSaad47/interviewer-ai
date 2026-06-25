import Link from "next/link";

import { CheckIcon } from "lucide-react";

import { AnimatedBadge } from "@/shared/ui/animated-badge";
import { Button } from "@/shared/ui/button";
import { FlowButton } from "@/shared/ui/flow-button";
import { Heading } from "@/shared/ui/heading";
import { Paragraph } from "@/shared/ui/paragraph";

export function HeroSection() {
  return (
    <section className="relative flex h-[100vh] items-center justify-center overflow-hidden bg-[#F7FAFF] px-4 py-12 md:px-8 dark:bg-[#080B0F]">
      {/* Premium Grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)]" />

      {/* Modern Lighting and Glow Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        {/* Soft Emerald Top Center glow */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 rounded-full opacity-60"
          style={{
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.16), rgba(52, 211, 153, 0))",
            filter: "blur(120px)",
          }}
        />
        {/* Soft Emerald-Teal Left glow */}
        <div
          className="absolute top-[20%] left-[-20%] rounded-full opacity-40"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(52, 211, 153, 0.12), transparent 70%)",
            filter: "blur(130px)",
          }}
        />
        {/* Soft Teal Right glow */}
        <div
          className="absolute right-[-10%] bottom-[10%] rounded-full opacity-45"
          style={{
            width: "650px",
            height: "650px",
            background:
              "radial-gradient(circle, rgba(45, 212, 191, 0.14), transparent 75%)",
            filter: "blur(140px)",
          }}
        />
      </div>

      <div className="container z-10 mx-auto max-w-6xl text-center">
        {/* Badge - Animated Badge */}
        <div
          className="mb-8 md:mb-16.5"
          style={{ marginTop: "clamp(40px, 8vw, 100px)" }}
        >
          <AnimatedBadge
            text="AI-Powered Interview Preparation"
            href="/interview/setup"
          />
        </div>

        {/* Main Heading */}
        <Heading
          as="h1"
          className="mx-auto mb-6 max-w-[90%] tracking-tight md:mb-8.25 md:max-w-250"
        >
          Master Your Interview Skills with{" "}
          <span className="text-gradient-primary">AI-Powered</span>
        </Heading>

        {/* Subheading */}
        <Paragraph
          as="p"
          className="mx-auto mb-8 max-w-[95%] md:mb-16 md:max-w-[820.32px]"
        >
          Experience the future of interview preparation with AI-powered
          practice sessions, real-time feedback, and comprehensive performance
          analytics
        </Paragraph>

        {/* CTA Buttons - Exact Figma specs */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 md:mb-23 md:flex-row">
          <Link href="/interview/setup">
            <FlowButton text="Start Interview" />
          </Link>
          <Link href="/problems">
            <Button
              size="lg"
              variant="outline"
              className="h-[50.94px] w-full rounded-[15px] border border-slate-200 bg-white/80 px-[40.75px] py-[10.19px] font-medium text-base text-slate-800 leading-[1.43em] shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:text-slate-950 active:scale-[0.96] md:w-auto md:text-[17.83px] dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/40 dark:text-[#EEF4F1] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] dark:hover:border-[rgba(52,211,153,0.32)] dark:hover:bg-[#142027]/80 dark:hover:text-white"
              style={{ fontFamily: "Geist" }}
            >
              Practice Coding
            </Button>
          </Link>
        </div>

        {/* Features List */}
        <div className="flex flex-col items-center justify-center gap-4 text-foreground md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            <Paragraph as="span" className="text-sm md:text-base">
              No credit card required
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            <Paragraph as="span" className="text-sm md:text-base">
              Free trial available
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            <Paragraph as="span" className="text-sm md:text-base">
              Cancel anytime
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Smooth transition to the dark section below */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[5] h-40 bg-[linear-gradient(to_top,#F6F9FF_0%,rgba(246,249,255,0.82)_35%,rgba(246,249,255,0)_100%)] dark:bg-[linear-gradient(to_top,#080B0F_0%,rgba(8,11,15,0.8)_35%,rgba(8,11,15,0)_100%)]" />
    </section>
  );
}
