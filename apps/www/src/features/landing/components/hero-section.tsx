import Link from "next/link";

import { CheckIcon } from "lucide-react";

import { AnimatedBadge } from "@/shared/ui/animated-badge";
import { Button } from "@/shared/ui/button";
import { FlowButton } from "@/shared/ui/flow-button";
import { Heading } from "@/shared/ui/heading";
import { Paragraph } from "@/shared/ui/paragraph";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center bg-[#060814] px-4 py-12 sm:min-h-[75vh] sm:py-14 md:min-h-[85vh] md:px-8 md:py-20 lg:min-h-screen lg:py-24 overflow-hidden">
      {/* Premium Grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(99,130,222,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,130,222,0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      {/* Modern Lighting and Glow Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        {/* Soft Indigo Top Center glow */}
        <div
          className="absolute left-1/2 top-[-10%] -translate-x-1/2 rounded-full opacity-60"
          style={{
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0))",
            filter: "blur(120px)",
          }}
        />
        {/* Soft Purple Left glow */}
        <div
          className="absolute left-[-20%] top-[20%] rounded-full opacity-40"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)",
            filter: "blur(130px)",
          }}
        />
        {/* Soft Cyan Right glow */}
        <div
          className="absolute right-[-10%] bottom-[10%] rounded-full opacity-45"
          style={{
            width: "650px",
            height: "650px",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.08), transparent 75%)",
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
          Master Your Interview Skills with AI-Powered
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
            <FlowButton
              text="Start Interview"
              className="border-primary/40 bg-primary hover:border-primary hover:text-primary [&>svg:first-child]:group-hover:stroke-primary [&>svg:last-child]:group-hover:stroke-primary"
            />
          </Link>
          <Link href="/problems">
            <Button
              size="lg"
              variant="outline"
              className="h-[50.94px] w-full rounded-[15px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm px-[40.75px] py-[10.19px] font-medium text-base text-neutral-300 leading-[1.43em] shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:border-white/20 active:scale-[0.96] md:w-auto md:text-[17.83px]"
              style={{ fontFamily: "Geist" }}
            >
              Practice Coding
            </Button>
          </Link>
        </div>

        {/* Features List */}
        <div className="flex flex-col items-center justify-center gap-4 text-foreground md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-foreground" />
            <Paragraph as="span" className="text-sm md:text-base">
              No credit card required
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-foreground" />
            <Paragraph as="span" className="text-sm md:text-base">
              Free trial available
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-foreground" />
            <Paragraph as="span" className="text-sm md:text-base">
              Cancel anytime
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Smooth transition to the dark section below */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-[5]"
        style={{
          backgroundImage:
            "linear-gradient(to top, #05070c 0%, rgba(5, 7, 12, 0.8) 35%, rgba(5, 7, 12, 0) 100%)",
        }}
      />
    </section>
  );
}
