import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsCard({
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 backdrop-blur-xl dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="font-bold text-foreground text-lg">
          {title}
        </CardTitle>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">{children}</CardContent>
    </Card>
  );
}
