import Image from "next/image";

import {
  AdditionalFeaturesSection,
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  HowItWorksSection,
  PricingSection,
  SuccessStoriesSection,
} from "@/modules/landing/components";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#000000]">
      {/* Mesh background from Figma - covers entire page */}
      <div className="fixed inset-0 -z-50">
        <Image
          src="/images/mesh-background.svg"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.4 }}
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
          className="absolute"
          style={{
            left: "-54px",
            top: "1001px",
            opacity: 0.26,
          }}
        />
        <Image
          src="/images/mask-group-2.svg"
          alt=""
          width={1517}
          height={1011}
          className="absolute"
          style={{
            left: "-54px",
            top: "1531px",
            opacity: 0.26,
          }}
        />
      </div>

      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AdditionalFeaturesSection />
        <HowItWorksSection />
        <SuccessStoriesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
