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
      <h2 className="text-foreground text-xl font-bold">Skills Overview</h2>

      <div className="grid grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <Card
            key={index}
            className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900"
          >
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">{skill.name}</div>
              <div className="text-foreground text-3xl font-bold">
                {skill.progress}%
              </div>
              <Progress
                value={skill.progress}
                className="h-2 bg-neutral-200 dark:bg-neutral-800 [&>div]:bg-[#6382DE]"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
