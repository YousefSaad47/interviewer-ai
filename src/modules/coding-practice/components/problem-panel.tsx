import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export function ProblemPanel() {
  return (
    <div className="bg-background flex h-full flex-col border-r border-neutral-300 px-4 pt-6 pr-3 md:px-8 md:pt-8 md:pr-5 lg:pl-20 dark:border-neutral-700">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <h1 className="text-foreground text-xl font-normal md:text-2xl lg:text-3xl">
          Two Sum
        </h1>
        <Badge className="rounded-xl border-transparent bg-[#6382DE] px-3 py-0.5 text-xs font-normal text-white md:px-4 md:py-1 md:text-sm">
          Easy
        </Badge>
      </div>

      {/* Problem Description with ScrollArea */}
      <ScrollArea className="flex-1 pr-2 md:pr-4">
        <div className="space-y-4 pb-6 md:space-y-5 md:pb-8">
          {/* Main Description */}
          {/* Main Description */}
          <div className="text-muted-foreground text-sm leading-relaxed md:text-base lg:text-xl">
            <span>Given an array of integers </span>
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs text-[#6382DE] md:px-2.5 md:py-1 md:text-base">
              nums
            </code>
            <span> and an integer </span>
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs text-[#6382DE] md:px-2.5 md:py-1 md:text-base">
              target
            </code>
            <span>
              , return indices of the two numbers such that they add up to
              target. You may assume that each input would have exactly one
              solution, and you may not use the same element twice. You can
              return the answer in any order.
            </span>
          </div>

          {/* Example 1 */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-foreground text-base md:text-lg lg:text-xl">
              Example 1:
            </h3>
            <div className="border-border bg-muted/50 rounded-xl border p-3 md:p-5">
              <div className="space-y-1">
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Input:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    nums = [2,7,11,15], target = 9
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Output:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    [0,1]
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    Explanation:
                  </span>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    {" "}
                    Because nums[0] + nums[1] == 9, we return [0, 1].
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-foreground text-base md:text-lg lg:text-xl">
              Example 2:
            </h3>
            <div className="border-border bg-muted/50 rounded-xl border p-3 md:p-5">
              <div className="space-y-1">
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Input:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    nums = [3,2,4], target = 6
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Output:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    [1,2]
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    Explanation:
                  </span>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    {" "}
                    Because nums[1] + nums[2] == 6, we return [1, 2].
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Example 3 */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-foreground text-base md:text-lg lg:text-xl">
              Example 3:
            </h3>
            <div className="border-border bg-muted/50 rounded-xl border p-3 md:p-5">
              <div className="space-y-1">
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Input:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    nums = [3,3], target = 6
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs text-[#6382DE] md:text-base">
                    Output:
                  </span>
                  <span className="text-foreground font-mono text-xs md:text-base">
                    {" "}
                    [0,1]
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    Explanation:
                  </span>
                  <span className="text-muted-foreground font-mono text-xs md:text-base">
                    {" "}
                    Because nums[0] + nums[1] == 6, we return [0, 1].
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
