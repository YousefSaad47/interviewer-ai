import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface SettingsCardProps {
  title: string;
  children: ReactNode;
}

export function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <Card className="rounded-3xl border-neutral-200 bg-neutral-50 shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-center font-semibold text-base text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
