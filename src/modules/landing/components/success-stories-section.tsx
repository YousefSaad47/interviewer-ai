import { Heading } from "@/shared/components/ui/heading";
import { Paragraph } from "@/shared/components/ui/paragraph";
import { SpotlightCard } from "@/shared/components/ui/spotlight-card";

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
    <section className="bg-background relative py-24">
      <div className="container mx-auto px-4">
        {/* Success Stories Header */}
        <div className="mb-16 text-center">
          <div className="border-border bg-card mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <svg
              className="text-primary h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-foreground text-sm font-medium">
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
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="from-primary to-primary/80 text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">
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
        <div className="mb-24 grid gap-12 divide-y *:text-center md:grid-cols-2 md:gap-8 md:divide-x md:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-4 pt-12 first:pt-0 md:pt-0">
              <div className="text-foreground text-5xl font-bold">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
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
              <div className="relative mb-4 aspect-3/4 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-foreground/10 absolute inset-0 flex items-center justify-center text-6xl font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <h3 className="text-foreground mb-1 font-bold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
