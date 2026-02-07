import Link from "next/link";

import { ArrowLeft, Brain } from "lucide-react";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Blurred Background Elements - Top Left and Bottom Right */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        {/* Top Left - Blue blur */}
        <div
          className="absolute rounded-full opacity-80"
          style={{
            top: "-300px",
            left: "-400px",
            width: "660px",
            height: "665px",
            background: "oklch(0.545 0.143 265.8)",
            filter: "blur(250px)",
          }}
        />
        {/* Bottom Right - Blue gradient */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-300px",
            right: "-400px",
            width: "660px",
            height: "665px",
            background: "oklch(0.545 0.143 265.8)",
            filter: "blur(250px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:py-12">
        {/* Auth Card */}
        <div className="w-full max-w-[480px] rounded-[20px] border border-neutral-200 bg-neutral-50 p-5 shadow-[3.5px_1.7px_8.5px_4.3px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-7 md:p-9 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
            {/* Header with Back and Logo */}
            <div className="flex w-full items-center justify-between">
              {/* Back as Guest */}
              <Link
                href="/"
                className="text-foreground flex items-center gap-[-2.2px] transition-opacity hover:opacity-80"
              >
                <ArrowLeft
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  strokeWidth={1.5}
                />
                <span className="text-[8px] leading-none font-bold sm:text-[10px]">
                  Back as Guest
                </span>
              </Link>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-[3.3px]">
                <Brain className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-foreground text-[12px] leading-none font-bold sm:text-[15px]">
                  Interviewer.Ai
                </span>
              </Link>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
