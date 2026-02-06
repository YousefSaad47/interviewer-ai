import { CheckIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 AI mock interviews per month",
        "Basic coding practice",
        "Performance analytics",
        "Community support",
        "Limited ATS resume scan",
      ],
      cta: "Get Started",
      highlighted: false,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Best for serious job seekers",
      features: [
        "Unlimited AI mock interviews",
        "Advanced coding practice",
        "Detailed performance analytics",
        "Verbal & emotional analysis",
        "Full ATS resume optimization",
        "Priority email support",
        "Interview question bank (1000+)",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      badge: "Most Popular",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Real human expert reviews (5/month)",
        "Interactive live practice sessions",
        "Remote screen control simulation",
        "Custom question sets",
        "Team analytics dashboard",
        "Dedicated account manager",
        "API access",
      ],
      cta: "Contact Sales",
      highlighted: false,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      className="bg-background relative overflow-hidden py-24"
      id="pricing"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "800px",
            height: "800px",
            transform: "translate(-50%, -50%)",
            background: "rgba(99, 130, 222, 0.05)",
            filter: "blur(150px)",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-6 text-5xl font-bold">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Select the perfect plan for your interview preparation journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? "border-primary from-primary/20 to-primary/10 shadow-primary/20 scale-105 border-2 bg-linear-to-b shadow-2xl"
                  : "border-border bg-card border"
              } hover:border-primary/50 transition-all duration-300`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="from-primary to-primary/80 text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r px-4 py-1 text-sm font-medium shadow-lg">
                  {plan.badge}
                </div>
              )}

              {/* Icon */}
              <div
                className={`h-12 w-12 rounded-xl ${
                  plan.highlighted ? "bg-primary" : "bg-primary/10"
                } mb-6 flex items-center justify-center ${
                  plan.highlighted ? "text-primary-foreground" : "text-primary"
                }`}
              >
                {plan.icon}
              </div>

              {/* Plan Name */}
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                {plan.name}
              </h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-5xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className={`mb-8 w-full ${
                  plan.highlighted
                    ? "from-primary to-primary/80 text-primary-foreground bg-linear-to-r hover:opacity-90"
                    : "border-border bg-card text-foreground hover:bg-accent border"
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
