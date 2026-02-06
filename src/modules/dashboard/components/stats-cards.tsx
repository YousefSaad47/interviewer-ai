import { BarChart3, Clock, Target, Trophy } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

const stats = [
  {
    icon: BarChart3,
    value: "24",
    label: "Interviews Completed",
  },
  {
    icon: Target,
    value: "87%",
    label: "Average Score",
  },
  {
    icon: Clock,
    value: "18h",
    label: "Practice Time",
  },
  {
    icon: Trophy,
    value: "12",
    label: "Skills Mastered",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900"
          >
            <CardContent className="flex items-center justify-between">
              <Icon className="text-primary h-9 w-9" />
              <span className="text-foreground text-3xl font-bold">
                {stat.value}
              </span>
            </CardContent>
            <CardContent className="text-muted-foreground text-sm">
              {stat.label}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
