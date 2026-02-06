import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface SettingsCardProps {
  title: string;
  children: ReactNode;
}

export function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <Card className="border-primary/20 bg-card/80 rounded-3xl shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-center text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
