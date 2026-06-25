import Image from "next/image";

import {
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  HowItWorksSection,
  SuccessStoriesSection,
} from "@/features/landing";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
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

        {/* Unified landing background wrapper from FeaturesSection to SuccessStoriesSection */}
        <div className="relative overflow-hidden bg-[#F6F9FF] text-foreground dark:bg-[#080B0F]">
          {/* Emerald/Teal highlight glows distributed across the unified section */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Glow 1: Top Right behind Comprehensive Platform header */}
            <div
              className="absolute rounded-full opacity-35 dark:opacity-60"
              style={{
                top: "2%",
                right: "-350px",
                width: "900px",
                height: "900px",
                background:
                  "radial-gradient(circle, rgba(52, 211, 153, 0.14), transparent 75%)",
                filter: "blur(200px)",
              }}
            />
            {/* Glow 2: Mid-Left behind AI mock interviews section */}
            <div
              className="absolute rounded-full opacity-30 dark:opacity-60"
              style={{
                top: "18%",
                left: "-400px",
                width: "1100px",
                height: "1100px",
                background:
                  "radial-gradient(circle, rgba(45, 212, 191, 0.12), transparent 75%)",
                filter: "blur(240px)",
              }}
            />
            {/* Glow 3: Mid-Right behind Additional Features (Our Features) */}
            <div
              className="absolute rounded-full opacity-25 dark:opacity-60"
              style={{
                top: "35%",
                right: "-400px",
                width: "1100px",
                height: "1100px",
                background:
                  "radial-gradient(circle, rgba(52, 211, 153, 0.12), transparent 75%)",
                filter: "blur(240px)",
              }}
            />
            {/* Glow 4: Mid-Left behind How It Works */}
            <div
              className="absolute rounded-full opacity-25 dark:opacity-60"
              style={{
                top: "52%",
                left: "-400px",
                width: "1100px",
                height: "1100px",
                background:
                  "radial-gradient(circle, rgba(45, 212, 191, 0.13), transparent 75%)",
                filter: "blur(240px)",
              }}
            />
            {/* Glow 5: Bottom Right/Center behind Testimonials & Success Stories */}
            <div
              className="absolute rounded-full opacity-25 dark:opacity-60"
              style={{
                top: "70%",
                right: "-350px",
                width: "1000px",
                height: "1000px",
                background:
                  "radial-gradient(circle, rgba(52, 211, 153, 0.13), transparent 75%)",
                filter: "blur(220px)",
              }}
            />
            {/* Glow 6: Bottom Left behind Meet Our Team */}
            <div
              className="absolute rounded-full opacity-25 dark:opacity-60"
              style={{
                top: "86%",
                left: "-350px",
                width: "900px",
                height: "900px",
                background:
                  "radial-gradient(circle, rgba(103, 232, 249, 0.12), transparent 75%)",
                filter: "blur(200px)",
              }}
            />
          </div>
          <div className="relative z-10">
            <FeaturesSection />
            <HowItWorksSection />
            <SuccessStoriesSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
