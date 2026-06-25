"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface CodeDigitInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export function CodeDigitInput({
  length = 6,
  value,
  onChange,
  className,
  error,
}: CodeDigitInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Only allow single digit
    if (val.length > 1) return;

    // Update the value
    const newValue = value.split("");
    newValue[index] = val;
    onChange(newValue.join(""));

    // Move to next input if value entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    onChange(pastedData);

    // Focus appropriate input after paste
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex h-12 w-full max-w-105 gap-2.5 sm:h-14 sm:gap-3.5",
          className,
        )}
      >
        {Array.from({ length }).map((_, index) => (
          <div
            key={`digit-${index}`}
            className={cn(
              "relative h-12 w-12 rounded-xl border bg-card sm:h-14 sm:w-14 dark:bg-surface-secondary",
              error ? "border-destructive" : "border-border dark:border-border",
            )}
          >
            <div className="flex h-full w-full items-center justify-center">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value[index] || ""}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                aria-invalid={!!error}
                className={cn(
                  "h-7 w-12 bg-transparent text-center font-semibold text-xl outline-none sm:h-8 sm:w-14 sm:text-2xl",
                  error ? "text-destructive" : "text-foreground",
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-center font-medium text-destructive text-xs sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
