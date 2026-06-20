"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brain, LogOut, Settings, User } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Menu } from "@/shared/components/menu";
import { SettingsIcon } from "@/shared/components/settings-icon";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const links = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/interview/setup", label: "Mock Interview" },
      { href: "/problems", label: "Coding Practice" },
      { href: "/resume-builder", label: "Resume Builder" },
    ],
    [],
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.03);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav className="fixed top-0 right-0 left-0 z-50 pt-2">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-3 transition-all duration-300 sm:px-6 lg:px-12",
            scrolled && "bg-background/95 shadow-lg backdrop-blur-xl",
          )}
        >
          <motion.div
            className={cn(
              "flex items-center justify-between py-3 transition-all duration-200 lg:py-6",
              scrolled && "lg:py-4",
            )}
          >
            {/* Logo - Exact Figma specs with Brain icon */}
            <Link href="/" className="flex items-center gap-[4.39px]">
              <Brain className="size-8 text-primary" />
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
            <nav
              className="hidden items-center gap-6.5 lg:flex"
              onMouseLeave={() => setSelectedTab(null)}
            >
              {links.map(({ href, label }, idx) => {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex h-12 items-center justify-center rounded-[15px] px-3.75 text-foreground",
                      pathname === href && "font-semibold",
                    )}
                    onMouseEnter={() => setSelectedTab(idx)}
                  >
                    {selectedTab === idx && (
                      <motion.span
                        layoutId="tab"
                        className={cn(
                          "absolute inset-0 rounded-[15px] bg-neutral-200 dark:bg-neutral-800",
                          scrolled && "bg-neutral-300 dark:bg-neutral-700",
                        )}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden items-center gap-6 lg:flex">
              <ThemeToggle />

              {isPending ? null : session ? (
                <>
                  <Link
                    href="/settings"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
                    aria-label="Settings"
                  >
                    <SettingsIcon size={20} />
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full transition-opacity hover:opacity-90"
                        aria-label="User menu"
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
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 size-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 size-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => authClient.signOut()}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button
                      variant="ghost"
                      className="rounded-[15px] px-5 py-2.5 font-medium text-[15px]"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="rounded-[15px] bg-primary px-5 py-2.5 font-medium text-[15px] text-primary-foreground hover:bg-primary/90">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="border-border border-t bg-background/95 backdrop-blur-md lg:hidden"
            >
              <nav className="container mx-auto flex flex-col space-y-2 px-4 py-4">
                {links.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-accent",
                        isActive && "bg-accent font-semibold",
                      )}
                      style={{
                        fontSize: "16px",
                        fontWeight: isActive ? 600 : 500,
                        fontFamily: "Geist",
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
                {isPending ? null : session ? (
                  <div className="flex items-center justify-between border-border border-t pt-4">
                    <ThemeToggle />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-full transition-opacity hover:opacity-90"
                          aria-label="User menu"
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
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="cursor-pointer"
                          >
                            <User className="mr-2 size-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/settings"
                            onClick={() => setMobileMenuOpen(false)}
                            className="cursor-pointer"
                          >
                            <Settings className="mr-2 size-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            authClient.signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <LogOut className="mr-2 size-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-border border-t pt-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="rounded-[15px] px-4 py-2 font-medium text-[15px]"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="rounded-[15px] bg-primary px-4 py-2 font-medium text-[15px]">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
