"use client";

import { useState } from "react";

import Link from "next/link";

import { Brain, Settings } from "lucide-react";

import { Menu } from "@/shared/components/menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 border-border/40 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8 lg:px-[59px]">
        {/* Logo - Exact Figma specs with Brain icon */}
        <Link href="/" className="flex items-center gap-[4.39px]">
          <Brain className="text-primary size-8" />
          <span
            className="text-foreground"
            style={{
              fontSize: "17.003px",
              lineHeight: "1em",
              fontWeight: 700,
              fontFamily: "Geist",
            }}
          >
            Interviewer.Ai
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Menu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
        </div>

        {/* Desktop Navigation - Exact Figma specs */}
        <nav className="hidden items-center gap-[26px] lg:flex">
          <Link
            href="/dashboard"
            className="text-foreground hover:bg-accent flex h-12 items-center justify-center rounded-[15px] px-[15px] transition-colors"
            style={{
              fontSize: "18.1px",
              lineHeight: "1em",
              letterSpacing: "-2.5%",
              fontWeight: 500,
              fontFamily: "Geist",
              textAlign: "center",
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/interview/setup"
            className="text-foreground hover:bg-accent flex h-12 items-center justify-center rounded-[15px] px-[15px] transition-colors"
            style={{
              fontSize: "18.1px",
              lineHeight: "1em",
              letterSpacing: "-2.5%",
              fontWeight: 500,
              fontFamily: "Geist",
              textAlign: "center",
            }}
          >
            Mock Interview
          </Link>
          <Link
            href="/coding-practice"
            className="text-foreground hover:bg-accent flex h-12 items-center justify-center rounded-[15px] px-[15px] transition-colors"
            style={{
              fontSize: "18.1px",
              lineHeight: "1em",
              letterSpacing: "-2.5%",
              fontWeight: 500,
              fontFamily: "Geist",
              textAlign: "center",
            }}
          >
            Coding Practice
          </Link>
          <Link
            href="/resume-builder"
            className="text-foreground hover:bg-accent flex h-12 items-center justify-center rounded-[15px] px-[15px] transition-colors"
            style={{
              fontSize: "18.1px",
              lineHeight: "1em",
              letterSpacing: "-2.5%",
              fontWeight: 500,
              fontFamily: "Geist",
              textAlign: "center",
            }}
          >
            Resume Builder
          </Link>
        </nav>

        {/* Actions - Exact Figma specs */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings Icon */}
          <Link
            href="/settings"
            className="text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* User Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-1 transition-opacity hover:opacity-90"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-600">
              {/* Placeholder avatar */}
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="18" cy="18" r="18" fill="#4B5563" />
                <circle cx="18" cy="14" r="6" fill="#9CA3AF" />
                <path
                  d="M6 32C6 26 11 22 18 22C25 22 30 26 30 32"
                  fill="#9CA3AF"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-border bg-background/95 border-t backdrop-blur-md lg:hidden">
          <nav className="container mx-auto flex flex-col space-y-2 px-4 py-4">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-colors"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "Geist",
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/interview/setup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-colors"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "Geist",
              }}
            >
              Mock Interview
            </Link>
            <Link
              href="/coding-practice"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-colors"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "Geist",
              }}
            >
              Coding Practice
            </Link>
            <Link
              href="/resume-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-colors"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "Geist",
              }}
            >
              Resume Builder
            </Link>
            <div className="border-border flex items-center justify-between border-t pt-4">
              <ThemeToggle />
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="transition-opacity hover:opacity-90"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-600">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="18" cy="18" r="18" fill="#4B5563" />
                    <circle cx="18" cy="14" r="6" fill="#9CA3AF" />
                    <path
                      d="M6 32C6 26 11 22 18 22C25 22 30 26 30 32"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
