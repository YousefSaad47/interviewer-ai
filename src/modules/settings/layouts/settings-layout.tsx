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

import { cn } from "@/lib/utils";
import { Header } from "@/modules/landing/components";

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
    <div className="bg-background min-h-screen">
      <Header />
      {/* Background textures */}
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          backgroundImage: "url('/noise-texture.png')",
          backgroundRepeat: "repeat",
          backgroundSize:
            "calc(var(--original-width) * 0.8488) calc(var(--original-height) * 0.8488)",
        }}
      />

      {/* Blurry backgrounds */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "-385px",
          left: "-517px",
          width: "660px",
          height: "665px",
          background: "oklch(0.545 0.143 265.8)",
          filter: "blur(250px)",
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          top: "423px",
          right: "-180px",
          width: "390px",
          height: "393px",
          background:
            "linear-gradient(180deg, oklch(0.545 0.143 265.8) 0%, oklch(0.545 0.143 265.8 / 0) 100%)",
          filter: "blur(358.5px)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col pt-20 lg:flex-row">
        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="border-border bg-background/95 sticky top-20 z-20 border-b backdrop-blur-sm lg:hidden">
          <div className="overflow-x-auto">
            <nav className="flex gap-2 px-4 py-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "border-primary/30 flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card/50 hover:bg-primary/10 hover:border-primary/40"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[14.5px] w-[14.5px]",
                        isActive ? "text-foreground" : "text-foreground/40"
                      )}
                    />
                    <span className="text-foreground whitespace-nowrap">
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
          <div className="bg-card/80 border-primary/20 rounded-3xl border p-6 shadow-lg backdrop-blur-sm lg:p-8">
            <div className="mb-9 flex items-center gap-1.25">
              <SettingsIcon className="h-6 w-6" />
              <h2 className="text-lg font-normal">Settings</h2>
            </div>

            <nav className="space-y-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group border-primary/30 flex items-center gap-2 rounded-lg border-b px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card/50 hover:bg-primary/10 hover:border-primary/40"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[14.5px] w-[14.5px]",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/40 group-hover:text-foreground"
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
