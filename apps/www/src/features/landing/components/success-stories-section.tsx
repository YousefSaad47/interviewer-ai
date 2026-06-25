import { Heading } from "@/shared/ui/heading";
import { Paragraph } from "@/shared/ui/paragraph";
import { SpotlightCard } from "@/shared/ui/spotlight-card";

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
    <section className="relative bg-gradient-to-b from-[#0c1224] to-[#05070f] py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Success Stories Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-foreground text-sm">
              Trusted by 50,000+ Professionals
            </span>
          </div>
          <Heading as="h2" className="mb-4">
            Success Stories
          </Heading>
          <Paragraph className="mx-auto max-w-2xl">
            See how professionals landed their dream jobs with our platform
          </Paragraph>
        </div>

        {/* Testimonials */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <SpotlightCard key={index} className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-6 text-muted-foreground italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 font-bold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-24 grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:divide-x md:divide-white/[0.06] lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="space-y-2 md:space-y-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-r from-white via-indigo-100 to-primary bg-clip-text text-transparent font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight drop-shadow-[0_2px_10px_rgba(90,125,255,0.15)]">
                {stat.value}
              </div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider md:text-sm lg:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-12 text-center">
          <Heading as="h2" className="mb-4">
            Meet Our Team
          </Heading>
          <Paragraph className="mx-auto max-w-2xl">
            We&apos;re a team of passionate engineers, designers, and educators
            dedicated to helping you succeed
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {team.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-5 aspect-3/4 overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[#111c33]/20 via-[#0d1426]/40 to-[#060814]/80 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-primary/35 group-hover:shadow-[0_20px_40px_rgba(90,125,255,0.08)]">
                {/* Glow behind initials */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(90,125,255,0.04),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Initials Text */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-7xl tracking-tighter bg-gradient-to-b from-white/15 to-white/3 bg-clip-text text-transparent select-none transition-all duration-500 group-hover:from-white/25 group-hover:to-white/5 group-hover:scale-105">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <h3 className="mb-1 font-bold text-foreground text-lg transition-colors group-hover:text-primary">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
