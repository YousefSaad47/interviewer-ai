import { Heading, Paragraph, SpotlightCard } from "@/shared/ui";

export function SuccessStoriesSection() {
  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "95%", label: "Success Rate" },
    { value: "500K+", label: "Mock Interviews" },
    { value: "4.9/5", label: "User Rating" },
  ];

  const testimonials = [
    {
      quote:
        "This platform completely transformed my interview preparation. The AI feedback was incredibly detailed and helped me identify areas I never knew I was weak in.",
      author: "Sarah Johnson",
      role: "Software Engineer at Google",
      avatar: "SJ",
    },
    {
      quote:
        "The mock interviews felt so realistic! I went into my actual interview feeling confident and prepared. Landed my dream job thanks to this platform.",
      author: "Michael Chen",
      role: "Product Manager at Meta",
      avatar: "MC",
    },
    {
      quote:
        "The coding practice with AI interviewer mode is brilliant. It's like having a personal coach available 24/7. Highly recommend for anyone preparing for technical interviews.",
      author: "Emily Rodriguez",
      role: "Full Stack Developer at Amazon",
      avatar: "ER",
    },
  ];

  const team = [
    { name: "VIKRAM SETHI", role: "Creative Director" },
    { name: "ELIAS SARKIS", role: "Production Manager" },
    { name: "YASMINA FARHAT", role: "Event Project Manager" },
    { name: "KARIM WAEL", role: "Senior Graphic & Web Designer" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7FAFF] to-[#EEF7F4] py-24 dark:from-[#0A1014] dark:to-[#0B1216]">
      <div className="container relative z-10 mx-auto px-4">
        {/* Success Stories Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 shadow-emerald-900/5 shadow-sm dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/60">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-slate-700 text-sm dark:text-[#EEF4F1]">
              Trusted by 50,000+ Professionals
            </span>
          </div>
          <Heading as="h2" className="mb-4 text-slate-950 dark:text-[#EEF4F1]">
            Success <span className="text-primary">Stories</span>
          </Heading>
          <Paragraph className="mx-auto max-w-2xl text-slate-600 dark:text-[#ACBAB5]">
            See how professionals landed their dream jobs with our platform
          </Paragraph>
        </div>

        {/* Testimonials */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <SpotlightCard key={index} className="relative overflow-hidden p-6">
              {/* Background Quote Mark */}
              <span className="pointer-events-none absolute top-2 right-4 select-none font-serif text-8xl text-slate-900/[0.04] leading-none dark:text-white/[0.03]">
                ”
              </span>

              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4.5 w-4.5 text-[#F6C85F]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-6 text-slate-600 text-sm italic leading-relaxed dark:text-[#ACBAB5]/95">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(52,211,153,0.32)] bg-gradient-to-br from-[#10B981] via-[#34D399] to-[#2DD4BF] font-bold text-white text-xs shadow-lg">
                  {testimonial.avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground text-sm">
                    {testimonial.author}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-500 text-xs dark:text-[#8D9C97]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-24 grid grid-cols-2 gap-4 text-center md:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="space-y-2 rounded-2xl border border-emerald-100 bg-white/75 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] md:space-y-3 dark:border-[rgba(167,243,208,0.12)] dark:bg-[#142027]/40 dark:hover:border-[rgba(52,211,153,0.32)] dark:hover:shadow-[0_12px_36px_rgba(52,211,153,0.08)]"
            >
              <div className="bg-gradient-to-r from-slate-950 via-[#059669] to-[#34D399] bg-clip-text font-extrabold text-3xl text-transparent tracking-tight drop-shadow-[0_2px_10px_rgba(52,211,153,0.11)] md:text-4xl lg:text-5xl dark:from-[#F4F7F6] dark:via-[#6EE7B7] dark:to-[#34D399]">
                {stat.value}
              </div>
              <p className="font-semibold text-[10px] text-slate-500 uppercase tracking-wider sm:text-xs dark:text-[#84938E]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-12 text-center">
          <Heading as="h2" className="mb-4 text-slate-950 dark:text-[#EEF4F1]">
            Meet Our <span className="text-primary">Team</span>
          </Heading>
          <Paragraph className="mx-auto max-w-2xl text-slate-600 dark:text-[#ACBAB5]">
            We&apos;re a team of passionate engineers, designers, and educators
            dedicated to helping you succeed
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {team.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-5 aspect-3/4 overflow-hidden rounded-2xl border border-emerald-100 bg-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-[#34D399]/40 group-hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)] dark:border-[rgba(167,243,208,0.08)] dark:bg-[#11191E] dark:group-hover:shadow-[0_20px_40px_rgba(52,211,153,0.08)]">
                {/* Glow behind initials */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.10),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.04),transparent_70%)]" />

                {/* Initials Text */}
                <div className="absolute inset-0 flex select-none items-center justify-center bg-gradient-to-b from-slate-900/35 to-slate-900/5 bg-clip-text font-bold text-7xl text-transparent tracking-tighter transition-all duration-500 group-hover:scale-105 group-hover:from-slate-900/45 group-hover:to-slate-900/10 dark:from-white/15 dark:to-white/3 dark:group-hover:from-white/25 dark:group-hover:to-white/5">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <h3 className="mb-1 font-bold text-lg text-slate-950 transition-colors group-hover:text-primary dark:text-[#EEF4F1]">
                {member.name}
              </h3>
              <p className="font-medium text-slate-500 text-sm dark:text-[#8D9C97]">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
