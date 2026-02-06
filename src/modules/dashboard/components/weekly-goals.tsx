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
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Your Goals This Week
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-base">{goal.title}</span>
              <span className="text-muted-foreground text-sm">
                {goal.progress}%
              </span>
            </div>
            <Progress
              value={goal.progress}
              className="h-2 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-[#6382DE]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
