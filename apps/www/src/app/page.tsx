import Image from "next/image";

import { AdditionalFeaturesSection } from "@/features/landing/components/additional-features-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { Footer } from "@/features/landing/components/footer";
import { Header } from "@/features/landing/components/header";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { SuccessStoriesSection } from "@/features/landing/components/success-stories-section";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Mesh background from Figma - covers entire page */}
      <div className="fixed inset-0 -z-50">
        <Image
          src="/images/mesh-background.svg"
          alt=""
          fill
          className="object-cover opacity-15 dark:opacity-40"
          priority
        />
      </div>

      {/* Mask group overlays from Figma */}
      <div className="pointer-events-none fixed -z-40 overflow-hidden">
        <Image
          src="/images/mask-group-1.svg"
          alt=""
          width={1517}
          height={1011}
          className="absolute opacity-10 dark:opacity-26"
          style={{
            left: "-54px",
            top: "1001px",
          }}
        />
        <Image
          src="/images/mask-group-2.svg"
          alt=""
          width={1517}
          height={1011}
          className="absolute opacity-10 dark:opacity-26"
          style={{
            left: "-54px",
            top: "1531px",
          }}
        />
      </div>

      <Header />
      <main>
        <HeroSection />

        {/* Unified black background wrapper from FeaturesSection to SuccessStoriesSection */}
        <div className="relative bg-[#05070c] text-foreground dark overflow-hidden">
          {/* Blue highlight glows distributed across the unified section */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Glow 1: Top Right behind Comprehensive Platform header */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "2%",
                right: "-350px",
                width: "900px",
                height: "900px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(280px)",
              }}
            />
            {/* Glow 2: Mid-Left behind AI mock interviews section */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "18%",
                left: "-400px",
                width: "1100px",
                height: "1100px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(320px)",
              }}
            />
            {/* Glow 3: Mid-Right behind Additional Features (Our Features) */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "35%",
                right: "-400px",
                width: "1100px",
                height: "1100px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(320px)",
              }}
            />
            {/* Glow 4: Mid-Left behind How It Works */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "52%",
                left: "-400px",
                width: "1100px",
                height: "1100px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(320px)",
              }}
            />
            {/* Glow 5: Bottom Right/Center behind Testimonials & Success Stories */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "70%",
                right: "-350px",
                width: "1000px",
                height: "1000px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(300px)",
              }}
            />
            {/* Glow 6: Bottom Left behind Meet Our Team */}
            <div
              className="absolute rounded-full opacity-90"
              style={{
                top: "86%",
                left: "-350px",
                width: "900px",
                height: "900px",
                background: "oklch(0.48 0.15 265.8)",
                filter: "blur(280px)",
              }}
            />
          </div>

          <div className="relative z-10">
            <FeaturesSection />
            <AdditionalFeaturesSection />
            <HowItWorksSection />
            <SuccessStoriesSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
