"use client";

import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Paragraph } from "@/shared/components/ui/paragraph";
import { SpotlightCard } from "@/shared/components/ui/spotlight-card";
import { WobbleCard } from "@/shared/components/ui/wobble-card";

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
      className="bg-background relative overflow-hidden py-12 md:py-24"
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
        <div className="mb-12 text-center md:mb-16">
          <Heading as="h2" className="mb-4 md:mb-6">
            Choose Your Plan
          </Heading>
          <Paragraph className="mx-auto max-w-2xl">
            Select the perfect plan for your interview preparation journey
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative flex md:hidden"
            >
              {plan.highlighted ? (
                <>
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-2 text-sm font-medium text-blue-900 shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <WobbleCard
                    containerClassName="group mt-3 flex h-full w-full flex-col bg-blue-900 shadow-2xl shadow-black-950/5"
                    className="flex h-full w-full flex-col p-6 pt-0 md:p-8"
                  >
                    {/* Icon */}
                    <div className="bg-primary-foreground text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6">
                      {plan.icon}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-primary-foreground mb-2 text-xl font-bold md:text-2xl">
                      {plan.name}
                    </h3>
                    <p className="text-primary-foreground/80 mb-4 text-sm md:mb-6 md:text-base">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4 md:mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-primary-foreground text-4xl font-bold md:text-5xl">
                          {plan.price}
                        </span>
                        <span className="text-primary-foreground/80 text-sm md:text-base">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 relative mb-6 w-full md:mb-8"
                      size="lg"
                      onClick={() =>
                        console.log(`CTA clicked for ${plan.name} plan`)
                      }
                    >
                      {plan.cta}
                    </Button>

                    {/* Features List */}
                    <ul className="flex-1 space-y-3 md:space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckIcon className="text-primary-foreground mt-0.5 h-5 w-5 shrink-0" />
                          <span className="text-primary-foreground/90 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </WobbleCard>
                </>
              ) : (
                <SpotlightCard className="mt-3 flex h-full w-full flex-col p-6 md:p-8">
                  {/* Icon */}
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6">
                    {plan.icon}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm md:mb-6 md:text-base">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-4xl font-bold md:text-5xl">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm md:text-base">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="border-border bg-card text-foreground hover:bg-accent mb-6 w-full border md:mb-8"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  {/* Features List */}
                  <ul className="flex-1 space-y-3 md:space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              )}
            </motion.div>
          ))}
          {plans.map((plan, index) => (
            <motion.div
              key={`desktop-${index}`}
              initial={{ y: 50, opacity: 1 }}
              whileInView={{
                y: plan.highlighted ? -20 : 0,
                opacity: 1,
                x: index === 2 ? -30 : index === 0 ? 30 : 0,
                scale: index === 0 || index === 2 ? 0.94 : 1.0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className="relative hidden md:flex"
            >
              {plan.highlighted ? (
                <>
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-2 text-sm font-medium text-blue-900 shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <WobbleCard
                    containerClassName="group mt-3 flex h-full w-full flex-col bg-blue-900 shadow-2xl shadow-black-950/5 md:scale-105"
                    className="flex h-full w-full flex-col p-8 pt-0"
                  >
                    {/* Icon */}
                    <div className="bg-primary-foreground text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
                      {plan.icon}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-primary-foreground mb-2 text-2xl font-bold">
                      {plan.name}
                    </h3>
                    <p className="text-primary-foreground/80 mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-primary-foreground text-5xl font-bold">
                          {plan.price}
                        </span>
                        <span className="text-primary-foreground/80">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 relative mb-8 w-full"
                      size="lg"
                      onClick={() =>
                        console.log(`CTA clicked for ${plan.name} plan`)
                      }
                    >
                      {plan.cta}
                    </Button>

                    {/* Features List */}
                    <ul className="flex-1 space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckIcon className="text-primary-foreground mt-0.5 h-5 w-5 shrink-0" />
                          <span className="text-primary-foreground/90 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </WobbleCard>
                </>
              ) : (
                <SpotlightCard className="mt-3 flex h-full w-full flex-col">
                  {/* Icon */}
                  <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
                    {plan.icon}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-foreground mb-2 text-2xl font-bold">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-5xl font-bold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="border-border bg-card text-foreground hover:bg-accent mb-8 w-full border"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  {/* Features List */}
                  <ul className="flex-1 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
