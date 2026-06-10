import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

const goals = [
  {
    title: "Complete 5 coding problems",
    progress: 60,
  },
  {
    title: "Practice system design",
    progress: 40,
  },
  {
    title: "Mock interview with feedback",
    progress: 80,
  },
];

export function WeeklyGoals() {
  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Your Goals This Week
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.map((goal, _index) => (
          <div key={goal.title} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground">{goal.title}</span>
              <span className="text-muted-foreground text-sm">
                {goal.progress}%
              </span>
            </div>
            <Progress
              value={goal.progress}
              className="h-2 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-primary"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
