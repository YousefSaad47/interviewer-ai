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

import { Header } from "@/features/landing";
import { cn } from "@/lib";

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
      <div
        className="pointer-events-none fixed inset-0 opacity-25 dark:opacity-45"
        style={{
          backgroundImage: "url('/noise-texture.png')",
          backgroundRepeat: "repeat",
          backgroundSize:
            "calc(var(--original-width) * 0.8488) calc(var(--original-height) * 0.8488)",
        }}
      />

      <div
        className="pointer-events-none fixed opacity-30 dark:opacity-60"
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
        className="pointer-events-none fixed opacity-25 dark:opacity-50"
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 pt-24 pb-14 sm:px-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 xl:px-10">
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

        <aside className="hidden lg:block">
          <div className="sticky top-28 overflow-hidden rounded-lg border border-border bg-card/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-card/90 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="border-border border-b p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                  <SettingsIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-foreground text-lg">
                    Settings
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Account controls
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 p-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-colors",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                        : "border-transparent text-foreground/70 hover:border-border hover:bg-white/60 hover:text-foreground dark:hover:bg-surface-secondary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md border",
                        isActive
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-white/55 text-foreground/45 dark:bg-card/60",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          !isActive && "group-hover:text-foreground",
                        )}
                      />
                    </span>
                    <span className="text-foreground">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="w-full py-8 lg:py-16">{children}</main>
      </div>
    </div>
  );
}
