import Link from "next/link";

import { ArrowUpRight, Code, FileText, Video } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

const actions = [
  {
    icon: Video,
    label: "Start Interview",
    primary: true,
    href: "/interview/setup",
  },
  {
    icon: FileText,
    label: "Update Resume",
    primary: false,
    href: "/resume-builder",
  },
  {
    icon: Code,
    label: "Coding Practice",
    primary: false,
    href: "/problems",
  },
];

export function QuickActions() {
  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b">
        <CardTitle className="font-bold text-foreground text-xl">
          Quick Actions
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Jump straight into the next task
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.href}
              asChild
              className={`group h-auto w-full justify-between rounded-lg px-4 py-4 text-sm ${
                action.primary
                  ? "bg-primary text-primary-foreground shadow-[0_14px_35px_rgba(16,185,129,0.22)] hover:bg-primary/90"
                  : "border border-border bg-white/70 text-foreground hover:border-primary/30 hover:bg-surface-strong dark:bg-surface-secondary dark:hover:bg-surface-elevated"
              }`}
            >
              <Link href={action.href}>
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      action.primary
                        ? "bg-white/15"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">{action.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
