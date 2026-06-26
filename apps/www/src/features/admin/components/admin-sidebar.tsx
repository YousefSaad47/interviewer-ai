"use client";

import Link from "next/link";

import { Brain, ChevronRight, LogOut, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib";
import { ThemeToggle } from "@/shared/components";
import { Button } from "@/shared/ui";

import { adminSections } from "../data";
import type { AdminSection } from "../types";
import { Avatar } from "./admin-primitives";

export function AdminSidebar({
  activeSection,
  onNavigate,
  onOpenChange,
  open,
}: {
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const content = (
    <aside className="flex h-full w-[280px] flex-col border-border/70 border-r bg-sidebar/88 px-4 py-5 backdrop-blur-xl">
      <Link className="mb-7 flex items-center gap-2 px-2" href="/">
        <Brain className="size-8 text-primary" />
        <span className="font-bold text-heading text-lg tracking-tight">
          Interviewer.Ai
        </span>
      </Link>

      <nav className="space-y-1">
        {adminSections.map((section) => {
          const Icon = section.icon;
          const selected = activeSection === section.id;
          return (
            <button
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-sm transition-all",
                selected
                  ? "border border-primary/20 bg-primary/10 text-heading shadow-[0_12px_34px_rgba(16,185,129,0.12)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              key={section.id}
              onClick={() => onNavigate(section.id)}
              type="button"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card/70 text-muted-foreground transition-colors",
                  selected && "border-primary/25 bg-primary/10 text-primary",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate">{section.label}</span>
              {selected && <ChevronRight className="size-4 text-primary" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-border/70 border-t pt-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card/70 px-3 py-2">
          <span className="font-medium text-sm">Theme</span>
          <ThemeToggle className="h-9 w-9 rounded-lg" />
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card/70 p-3">
          <Avatar name="Karim Amin" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm">Karim Amin</p>
            <p className="truncate text-muted-foreground text-xs">
              Super Admin
            </p>
          </div>
        </div>
        <Button
          className="w-full justify-start gap-2 rounded-lg"
          variant="ghost"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {content}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ x: 0 }}
              className="h-full"
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="relative h-full w-[280px]">
                <Button
                  aria-label="Close admin navigation"
                  className="absolute top-4 right-[-3.25rem] h-10 w-10 rounded-lg"
                  onClick={() => onOpenChange(false)}
                  size="icon"
                  variant="outline"
                >
                  <X className="size-4" />
                </Button>
                {content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
