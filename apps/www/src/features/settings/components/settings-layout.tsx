"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  FileText,
  ListChecks,
  Settings as SettingsIcon,
  Shield,
  User,
  Video,
} from "lucide-react";

import { Header } from "@/features/landing/components/header";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    label: "Profile & Account",
    href: "/settings/profile",
    icon: User,
  },
  {
    label: "Interview Setting",
    href: "/settings/interview",
    icon: SettingsIcon,
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    label: "Privacy & Security",
    href: "/settings/privacy",
    icon: Shield,
  },
  {
    label: "Audio & Video",
    href: "/settings/audio-video",
    icon: Video,
  },
  {
    label: "Resume Builder",
    href: "/settings/resume",
    icon: FileText,
  },
  {
    label: "Assessment Options",
    href: "/settings/assessment",
    icon: ListChecks,
  },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Background textures */}
      <div
        className="pointer-events-none fixed inset-0 opacity-35 dark:opacity-60"
        style={{
          backgroundImage: "url('/noise-texture.png')",
          backgroundRepeat: "repeat",
          backgroundSize:
            "calc(var(--original-width) * 0.8488) calc(var(--original-height) * 0.8488)",
        }}
      />

      {/* Blurry backgrounds */}
      <div
        className="pointer-events-none fixed opacity-35 dark:opacity-60"
        style={{
          top: "-385px",
          left: "-517px",
          width: "660px",
          height: "665px",
          background: "#10B981",
          filter: "blur(250px)",
        }}
      />
      <div
        className="pointer-events-none fixed opacity-30 dark:opacity-55"
        style={{
          top: "423px",
          right: "-180px",
          width: "390px",
          height: "393px",
          background:
            "linear-gradient(180deg, #10B981 0%, rgb(16 185 129 / 0) 100%)",
          filter: "blur(358.5px)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col pt-20 lg:flex-row">
        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="sticky top-20 z-20 border-border border-b bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="overflow-x-auto">
            <nav className="flex gap-2 px-4 py-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "border-primary/35 bg-card text-foreground shadow-sm dark:bg-surface-secondary"
                        : "border-border bg-white/70 text-foreground/75 hover:border-primary/30 hover:bg-card hover:text-foreground dark:bg-card/75 dark:hover:bg-surface-secondary",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[14.5px] w-[14.5px]",
                        isActive ? "text-foreground" : "text-foreground/40",
                      )}
                    />
                    <span className="whitespace-nowrap text-foreground">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 p-5 lg:block xl:w-72">
          <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-[0_16px_48px_rgba(15,23,42,0.07)] backdrop-blur-md lg:p-8 dark:bg-card dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="mb-9 flex items-center gap-1.25">
              <SettingsIcon className="h-6 w-6" />
              <h2 className="font-normal text-lg">Settings</h2>
            </div>

            <nav className="space-y-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg border-b px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "border-primary/35 bg-card text-foreground shadow-sm dark:bg-surface-secondary"
                        : "border-border bg-white/70 text-foreground/75 hover:border-primary/30 hover:bg-card hover:text-foreground dark:bg-card/75 dark:hover:bg-surface-secondary",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[14.5px] w-[14.5px]",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/40 group-hover:text-foreground",
                      )}
                    />
                    <span className="text-foreground">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-8 sm:px-8 md:px-12 lg:px-16 lg:py-24 xl:py-28">
          {children}
        </main>
      </div>
    </div>
  );
}
