interface ExampleCaseProps {
  number: number;
  input: string;
  output: string;
  explanation: string;
}

export function ExampleCase({
  number,
  input,
  output,
  explanation,
}: ExampleCaseProps) {
  return (
    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
      <h3 className="text-foreground text-sm font-medium sm:text-base md:text-lg">
        Example {number}:
      </h3>
      <div className="bg-muted/30 rounded-lg border p-3 sm:p-3.5 md:p-4 dark:border-[#1a1a1a] dark:bg-[#232323]">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <span className="text-primary font-mono text-xs font-semibold md:text-sm">
              Input:
            </span>
            <span className="text-foreground font-mono text-xs md:text-sm">
              {input}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-primary font-mono text-xs font-semibold md:text-sm">
              Output:
            </span>
            <span className="text-foreground font-mono text-xs md:text-sm">
              {output}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-muted-foreground font-mono text-xs md:text-sm">
              Explanation:
            </span>
            <span className="text-muted-foreground font-mono text-xs md:text-sm">
              {explanation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
