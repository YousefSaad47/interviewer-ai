import Link from "next/link";

import { Code, FileText, Video } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

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
    <Card className="rounded-2xl border-border bg-card dark:bg-card">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="w-full">
              <Button
                className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-6 text-base ${
                  action.primary
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border-border bg-white/75 text-foreground hover:bg-surface-strong dark:bg-surface-secondary dark:hover:bg-surface-elevated"
                }`}
              >
                <Icon className="h-5 w-5" />
                {action.label}
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
