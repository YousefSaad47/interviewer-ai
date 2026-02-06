import Link from "next/link";

import { Code, FileText, Video } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

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
    href: "/coding-practice",
  },
];

export function QuickActions() {
  return (
    <Card className="border-border rounded-2xl bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} href={action.href} className="w-full">
              <Button
                className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-6 text-base ${
                  action.primary
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "border-border text-foreground bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
