import { Heading } from "@/shared/ui/heading";
import { Paragraph } from "@/shared/ui/paragraph";
import { SpotlightCard } from "@/shared/ui/spotlight-card";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up & Set Goals",
      description:
        "Create your account and tell us about your target role, company, and timeline. Our AI will customize your preparation path.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Practice with AI",
      description:
        "Choose from technical coding challenges, behavioral questions, or system design interviews. Get instant feedback and guidance.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Get Detailed Feedback",
      description:
        "Receive comprehensive analysis of your performance including strengths, areas for improvement, and personalized recommendations.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Track & Improve",
      description:
        "Monitor your progress with analytics dashboards. Build confidence through consistent practice and measurable improvement.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-background py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Heading as="h2" className="mb-6">
            How It Work
          </Heading>
          <Paragraph className="mx-auto max-w-2xl">
            Get started in minutes and begin your journey to interview success
          </Paragraph>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line (hidden on last item) */}
              {/* {index < steps.length - 1 && (
                <div className="from-primary/50 absolute top-14 left-[calc(50%+32px)] hidden h-0.5 w-[calc(100%-64px)] bg-linear-to-r to-transparent lg:block" />
              )} */}

              <div className="relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 font-bold text-lg text-primary-foreground shadow-lg shadow-primary/20">
                  {step.number}
                </div>

                {/* Card */}
                <SpotlightCard className="group pt-8 pr-6 pb-6 pl-8">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 font-bold text-foreground text-xl">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </SpotlightCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
