interface ExampleCaseProps {
  number: number;
  input: string;
  output: string;
  explanation?: string;
}

export function ExampleCase({
  number,
  input,
  output,
  explanation,
}: ExampleCaseProps) {
  return (
    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
      <h3 className="font-medium text-foreground text-sm sm:text-base md:text-lg">
        Example {number}:
      </h3>
      <div className="rounded-lg border bg-muted/30 p-3 sm:p-3.5 md:p-4 dark:border-[#1a1a1a] dark:bg-[#232323]">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <span className="font-mono font-semibold text-primary text-xs md:text-sm">
              Input:
            </span>
            <span className="font-mono text-foreground text-xs md:text-sm">
              {input}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-mono font-semibold text-primary text-xs md:text-sm">
              Output:
            </span>
            <span className="font-mono text-foreground text-xs md:text-sm">
              {output}
            </span>
          </div>
          {explanation && (
            <div className="flex flex-wrap gap-1">
              <span className="font-mono text-muted-foreground text-xs md:text-sm">
                Explanation:
              </span>
              <span className="font-mono text-muted-foreground text-xs md:text-sm">
                {explanation}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
