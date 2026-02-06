import Link from "next/link";

import { CheckIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20 md:px-8">
      {/* Background Effects from Figma */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        {/* Gradient ellipses matching Figma positions */}
        <div
          className="absolute rounded-full opacity-80"
          style={{
            top: "-300px",
            left: "-400px",
            width: "660px",
            height: "665.25px",
            background: "oklch(0.545 0.143 265.8)",
            filter: "blur(250px)",
          }}
        />
        <div
          className="absolute hidden rounded-full opacity-80 lg:block"
          style={{
            bottom: "-50px",
            right: "-450px",
            width: "660px",
            height: "665.25px",
            background: "oklch(0.545 0.143 265.8)",
            filter: "blur(250px)",
          }}
        />
      </div>

      <div className="z-10 container mx-auto max-w-6xl text-center">
        {/* Badge - Exact Figma positioning */}
        <div
          className="border-primary/60 bg-card mb-8 inline-flex items-center gap-2 rounded-full border-[0.8px] px-6 py-2 md:mb-[66px] md:px-[33px] md:py-[9px]"
          style={{ marginTop: "clamp(80px, 15vw, 176px)" }}
        >
          <div
            className="bg-primary/60 h-2 w-2 rounded-full opacity-[0.59]"
            style={{ boxShadow: "0 0 8px rgba(101, 125, 196, 0.6)" }}
          />
          <span
            className="text-xs leading-[1.5em] font-normal text-[#85A3FF] md:text-[13.87px]"
            style={{ fontFamily: "Geist" }}
          >
            AI-Powered Interview Preparation
          </span>
        </div>

        {/* Main Heading - Exact Figma typography */}
        <h1
          className="text-foreground mx-auto mb-6 max-w-[90%] text-4xl md:mb-[33px] md:max-w-[1000px] md:text-6xl lg:text-[74px]"
          style={{
            lineHeight: "1em",
            letterSpacing: "-2.5%",
            fontWeight: 700,
            fontFamily: "Geist",
            textAlign: "center",
          }}
        >
          Master Your Interview Skills with AI-Powered
        </h1>

        {/* Subheading - Exact Figma specs */}
        <p
          className="text-muted-foreground mx-auto mb-8 max-w-[95%] text-base md:mb-[64px] md:max-w-[820.32px] md:text-xl lg:text-[20.59px]"
          style={{
            lineHeight: "1.56em",
            fontWeight: 500,
            fontFamily: "Geist",
            textAlign: "center",
          }}
        >
          Experience the future of interview preparation with AI-powered
          practice sessions, real-time feedback, and comprehensive performance
          analytics
        </p>

        {/* CTA Buttons - Exact Figma specs */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 md:mb-[92px] md:flex-row">
          <Link href="/interview/setup">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-[50.94px] w-full rounded-[15px] px-[40.75px] py-[10.19px] text-base leading-[1.43em] font-medium shadow-[0px_1.27px_2.55px_0px_rgba(26,26,26,0.05)] md:w-auto md:text-[17.83px]"
              style={{ fontFamily: "Geist" }}
            >
              Start Interview
            </Button>
          </Link>
          <Link href="/coding-practice">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-foreground hover:bg-accent h-[50.94px] w-full rounded-[15px] border-[1px] bg-transparent px-[40.75px] py-[10.19px] text-base leading-[1.43em] font-medium shadow-[0px_1.27px_2.55px_0px_rgba(26,26,26,0.05)] md:w-auto md:text-[17.83px]"
              style={{ fontFamily: "Geist" }}
            >
              Practice Coding
            </Button>
          </Link>
        </div>

        {/* Features List - Exact Figma positioning */}
        <div className="text-foreground flex flex-col items-center justify-center gap-4 md:flex-row md:gap-[32px]">
          <div className="flex items-center gap-2">
            <CheckIcon className="text-foreground h-5 w-5" />
            <span
              className="text-sm leading-[1.5em] font-normal md:text-[16px]"
              style={{ fontFamily: "Geist" }}
            >
              No credit card required
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="text-foreground h-5 w-5" />
            <span
              className="text-sm leading-[1.5em] font-normal md:text-[16px]"
              style={{ fontFamily: "Geist" }}
            >
              Free trial available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="text-foreground h-5 w-5" />
            <span
              className="text-sm leading-[1.5em] font-normal md:text-[16px]"
              style={{ fontFamily: "Geist" }}
            >
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
