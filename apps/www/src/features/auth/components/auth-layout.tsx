import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex flex-col justify-between select-none">
      {/* Vercel-like Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Decorative Blur Spheres */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Soft emerald glow in center-top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[120px] opacity-70 dark:opacity-40" />
        
        {/* Subtle secondary glows */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] opacity-50" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] opacity-50" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        {/* Glassmorphic Auth Card */}
        <div className="w-full max-w-[440px] rounded-2xl border border-white/[0.08] dark:border-white/[0.05] bg-white/70 dark:bg-[#0B0F13]/70 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 ring-1 ring-black/[0.03] dark:ring-white/[0.02]">
          <div className="flex flex-col items-center gap-6 md:gap-7">
            {/* Header */}
            <div className="flex w-full items-center justify-between border-b border-border/30 dark:border-border/10 pb-4">
              {/* Back Link */}
              <Link
                href="/"
                className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 rounded px-1 py-0.5"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                  strokeWidth={2}
                />
                <span>Back as Guest</span>
              </Link>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 rounded px-1 py-0.5"
              >
                <Brain className="h-5 w-5 text-primary" strokeWidth={2} />
                <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Interviewer.Ai
                </span>
              </Link>
            </div>

            {/* Page Content */}
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full text-center py-4 text-[11px] text-muted-foreground/40 border-t border-border/5 dark:border-border/5">
        &copy; {new Date().getFullYear()} Interviewer.Ai. All rights reserved.
      </div>
    </div>
  );
}
