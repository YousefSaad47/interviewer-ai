import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { ExampleCase } from "./example-case";

export function ProblemPanel() {
  const examples = [
    {
      number: 1,
      input: "nums = [2, 7, 11, 15], target = 9",
      output: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      number: 2,
      input: "nums = [3, 2, 4], target = 6",
      output: "[1, 2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      number: 3,
      input: "nums = [3, 3], target = 6",
      output: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
    },
  ];

  return (
    <div className="bg-background flex h-full flex-col px-4 pt-6 sm:px-6 sm:pt-8 md:px-8 md:pt-10 lg:px-12 lg:pt-12 xl:px-16">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <div className="flex-1">
          <h1 className="text-foreground mb-1 text-xl font-semibold sm:text-2xl md:text-3xl">
            Two Sum
          </h1>
        </div>
        <Badge className="bg-primary shrink-0 rounded-lg border-transparent px-3 py-1 text-xs font-medium text-white md:px-4 md:py-1.5 md:text-sm">
          Easy
        </Badge>
      </div>

      {/* Problem Description with ScrollArea */}
      <ScrollArea className="flex-1 pr-2 md:pr-4">
        <div className="space-y-4 pb-6 sm:space-y-5 sm:pb-8 md:space-y-6 md:pb-10">
          {/* Main Description */}
          <section>
            <div className="text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
              Given an array of integers{" "}
              <code className="bg-muted text-primary rounded px-2 py-0.5 font-mono text-sm md:px-2.5 md:text-base dark:bg-[#232323]">
                nums
              </code>{" "}
              and an integer{" "}
              <code className="bg-muted text-primary rounded px-2 py-0.5 font-mono text-sm md:px-2.5 md:text-base dark:bg-[#232323]">
                target
              </code>
              , return indices of the two numbers such that they add up to{" "}
              <code className="bg-muted text-primary rounded px-2 py-0.5 font-mono text-sm md:px-2.5 md:text-base dark:bg-[#232323]">
                target
              </code>
              .
              <div className="mt-3">
                You may assume that each input would have exactly one solution,
                and you may not use the same element twice. You can return the
                answer in any order.
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="space-y-4 md:space-y-5">
            {examples.map((example) => (
              <ExampleCase key={example.number} {...example} />
            ))}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
