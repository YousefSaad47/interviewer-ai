import { Heading, Paragraph, SpotlightCard } from "@/shared/ui";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF7F4] to-[#F7FAFF] py-24 dark:from-[#0C1216] dark:to-[#0E171B]">
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Heading as="h2" className="mb-6 text-slate-950 dark:text-[#EEF4F1]">
            How It <span className="text-primary">Works</span>
          </Heading>
          <Paragraph className="mx-auto max-w-2xl text-slate-600 dark:text-[#ACBAB5]">
            Get started in minutes and begin your journey to interview success
          </Paragraph>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              {/* Connecting line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-20 left-[75%] -z-10 hidden h-[1.5px] w-[70%] bg-gradient-to-r from-[#34D399]/28 via-[#34D399]/10 to-transparent lg:block dark:from-[#34D399]/18 dark:via-[#34D399]/5" />
              )}

              <div className="relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#34D399]/40 bg-white font-bold font-mono text-[#047857] text-xs shadow-[0_8px_24px_rgba(16,185,129,0.15)] dark:bg-[#142027] dark:text-[#F4F7F6] dark:shadow-[0_0_12px_rgba(52,211,153,0.13)]">
                  {step.number}
                </div>

                {/* Card */}
                <SpotlightCard className="group pt-8 pr-6 pb-6 pl-8">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/12 to-primary/3 text-primary transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.18)]">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 font-bold text-slate-950 text-xl dark:text-[#EEF4F1]">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed dark:text-[#ACBAB5]/85">
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
