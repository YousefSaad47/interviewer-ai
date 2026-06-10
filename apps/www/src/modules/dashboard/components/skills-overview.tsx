import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

const skills = [
  { name: "Data Structures", progress: 85 },
  { name: "Algorithms", progress: 78 },
  { name: "System Design", progress: 72 },
  { name: "Behavioral", progress: 92 },
];

export function SkillsOverview() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-foreground text-xl">Skills Overview</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {skills.map((skill, _index) => (
          <Card
            key={skill.name}
            className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900"
          >
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">{skill.name}</div>
              <div className="font-bold text-3xl text-foreground">
                {skill.progress}%
              </div>
              <Progress
                value={skill.progress}
                className="h-2 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-primary"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
