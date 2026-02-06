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
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Recent Interviews
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {interviews.map((interview, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-lg bg-neutral-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-800"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg p-3">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-base font-medium">
                  {interview.type}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-sm">
                    {interview.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:space-y-1">
              <span className="text-primary text-lg font-bold">
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
