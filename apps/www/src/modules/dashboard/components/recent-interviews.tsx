import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const interviews = [
  {
    type: "Technical Interview",
    date: "2026-02-03",
    score: "85%",
    duration: "45 min",
  },
  {
    type: "Behavioral Interview",
    date: "2026-02-01",
    score: "92%",
    duration: "30 min",
  },
  {
    type: "System Design Interview",
    date: "2026-01-29",
    score: "78%",
    duration: "60 min",
  },
];

export function RecentInterviews() {
  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Recent Interviews
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {interviews.map((interview, _index) => (
          <div
            key={interview.type}
            className="flex flex-col gap-3 rounded-lg bg-neutral-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-800"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 p-3">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-base text-foreground">
                  {interview.type}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {interview.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:space-y-1">
              <span className="font-bold text-lg text-primary">
                {interview.score}
              </span>
              <span className="text-muted-foreground text-sm">
                {interview.duration}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
