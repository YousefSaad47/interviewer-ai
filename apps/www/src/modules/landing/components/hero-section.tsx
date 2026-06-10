import Link from "next/link";

import { CheckIcon } from "lucide-react";

import { AnimatedBadge } from "@/shared/components/ui/animated-badge";
import { Button } from "@/shared/components/ui/button";
import { FlowButton } from "@/shared/components/ui/flow-button";
import { Heading } from "@/shared/components/ui/heading";
import { Paragraph } from "@/shared/components/ui/paragraph";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:min-h-[75vh] sm:py-14 md:min-h-[85vh] md:px-8 md:py-20 lg:min-h-screen lg:py-24">
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

      <div className="container z-10 mx-auto max-w-6xl text-center">
        {/* Badge - Animated Badge */}
        <div
          className="mb-8 md:mb-16.5"
          style={{ marginTop: "clamp(80px, 15vw, 176px)" }}
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
          <Link href="/coding-practice">
            <Button
              size="lg"
              variant="outline"
              className="h-[50.94px] w-full rounded-[15px] border border-border bg-transparent px-[40.75px] py-[10.19px] font-medium text-base text-foreground leading-[1.43em] shadow-[0px_1.27px_2.55px_0px_rgba(26,26,26,0.05)] hover:bg-accent md:w-auto md:text-[17.83px]"
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
    </section>
  );
}
