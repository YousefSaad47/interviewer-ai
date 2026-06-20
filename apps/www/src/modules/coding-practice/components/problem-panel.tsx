import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { ExampleCase } from "./example-case";

interface ProblemPanelProps {
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
  };
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  return (
    <div className="flex h-full flex-col bg-background px-4 pt-6 sm:px-6 sm:pt-8 md:px-8 md:pt-10 lg:px-12 lg:pt-12 xl:px-16">
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <div className="flex-1">
          <h1 className="mb-1 font-semibold text-foreground text-xl sm:text-2xl md:text-3xl">
            {problem.title}
          </h1>
        </div>
        <Badge className="shrink-0 rounded-lg border-transparent bg-primary px-3 py-1 font-medium text-white text-xs md:px-4 md:py-1.5 md:text-sm">
          {problem.difficulty}
        </Badge>
      </div>

      <ScrollArea className="flex-1 pr-2 md:pr-4">
        <div className="space-y-4 pb-6 sm:space-y-5 sm:pb-8 md:space-y-6 md:pb-10">
          <section>
            <div className="text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
              {problem.description}
            </div>
          </section>

          <section className="space-y-4 md:space-y-5">
            {problem.examples.map((example, index) => (
              <ExampleCase
                key={`example-${index}`}
                number={index + 1}
                input={example.input}
                output={example.output}
                explanation={example.explanation}
              />
            ))}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
