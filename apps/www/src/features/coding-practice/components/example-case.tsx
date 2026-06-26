"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const copyToClipboard = () => {
    const copyText = `Input:\n${input}\n\nOutput:\n${output}${
      explanation ? `\n\nExplanation:\n${explanation}` : ""
    }`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInputOnly = () => {
    navigator.clipboard.writeText(input);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  };

  const copyOutputOnly = () => {
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="group/example space-y-3 rounded-xl border border-border/40 bg-card/45 p-4 shadow-sm transition-all duration-200 hover:border-border-interactive/40 hover:bg-card/70 sm:p-5 dark:bg-card/25 dark:hover:bg-card/45">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-heading text-sm tracking-tight sm:text-base">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 font-bold text-[10px] text-primary sm:size-5.5 sm:text-xs dark:bg-primary/20">
            {number}
          </span>
          Example {number}
        </h4>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs transition-colors duration-150 hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="font-medium text-[11px] text-emerald-500">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="font-medium text-[11px]">Copy example</span>
            </>
          )}
        </button>
      </div>

      {/* Unified Code block with editor aesthetics */}
      <div className="relative overflow-hidden rounded-lg border border-border/30 bg-muted/40 dark:bg-surface-secondary/40">
        {/* Terminal/Window Top Bar */}
        <div className="flex items-center justify-between border-border/20 border-b bg-muted/20 px-3.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="select-none font-mono text-[10px] text-muted-foreground">
            example_{number}.txt
          </span>
        </div>

        {/* Code Content */}
        <div className="space-y-4 p-4 font-mono text-foreground text-xs leading-relaxed md:text-sm">
          {/* Input Section */}
          <div className="group/input relative space-y-1">
            <div className="flex items-center justify-between">
              <span className="select-none font-bold text-[11px] text-primary uppercase tracking-wider sm:text-xs">
                Input
              </span>
              <button
                type="button"
                onClick={copyInputOnly}
                className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground opacity-0 transition-all duration-150 hover:text-foreground focus:opacity-100 group-hover/input:opacity-100"
                title="Copy input values only"
              >
                {copiedInput ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="font-medium text-emerald-500">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy input</span>
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all border-primary/25 border-l pl-3 text-paragraph">
              {input}
            </pre>
          </div>

          {/* Output Section */}
          <div className="group/output relative space-y-1">
            <div className="flex items-center justify-between">
              <span className="select-none font-bold text-[11px] text-primary uppercase tracking-wider sm:text-xs">
                Output
              </span>
              <button
                type="button"
                onClick={copyOutputOnly}
                className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground opacity-0 transition-all duration-150 hover:text-foreground focus:opacity-100 group-hover/output:opacity-100"
                title="Copy output values only"
              >
                {copiedOutput ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="font-medium text-emerald-500">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy output</span>
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all border-primary/25 border-l pl-3 text-paragraph">
              {output}
            </pre>
          </div>
        </div>
      </div>

      {explanation && (
        <div className="rounded-lg border border-border-subtle bg-muted/10 p-3 text-muted-foreground text-xs leading-relaxed sm:text-sm dark:bg-surface-product/35">
          <span className="mr-1.5 font-semibold text-foreground">
            Explanation:
          </span>
          {explanation}
        </div>
      )}
    </div>
  );
}
