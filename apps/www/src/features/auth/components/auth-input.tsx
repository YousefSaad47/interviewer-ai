"use client";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib";
import { Input } from "@/shared/ui";

export interface AuthInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  icon?: "user" | "email" | "password" | undefined;
  label?: string | undefined;
  type?: "text" | "email" | "password" | undefined;
  error?: string | undefined;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, icon, label, type = "text", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const IconComponent =
      icon === "user" ? User : icon === "email" ? Mail : Lock;

    return (
      <div className="w-full group/input">
        {/* Label */}
        {label && (
          <label className="mb-1.5 block text-xs font-semibold text-foreground/60 dark:text-foreground/50 tracking-wide select-none transition-colors group-focus-within/input:text-primary">
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex w-full items-center rounded-lg border bg-white/30 dark:bg-black/20 px-3 py-2 transition-all duration-200 backdrop-blur-md",
            error
              ? "border-destructive/80 focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/15"
              : isFocused
                ? "border-primary/60 ring-2 ring-primary/10 dark:ring-primary/15 dark:border-primary/50"
                : "border-border/40 dark:border-white/[0.06] hover:border-border-interactive dark:hover:border-white/[0.12]",
            className,
          )}
        >
          {/* Icon */}
          {icon && (
            <div className="mr-2.5 h-4 w-4 shrink-0 flex items-center justify-center">
              <IconComponent
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  error
                    ? "text-destructive"
                    : isFocused
                      ? "text-primary"
                      : "text-foreground/35 dark:text-foreground/25",
                )}
              />
            </div>
          )}

          {/* Input */}
          <Input
            ref={ref}
            type={inputType}
            placeholder={label ? undefined : props.placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            className={cn(
              "!bg-transparent dark:!bg-transparent h-8 w-full border-0 p-0 font-normal text-sm text-foreground shadow-none outline-none ring-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:ring-0",
              "placeholder:text-foreground/30 dark:placeholder:text-foreground/20 placeholder:font-normal selection:bg-primary/20",
            )}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-2 h-5 w-5 shrink-0 flex items-center justify-center text-foreground/30 hover:text-foreground/60 transition-colors focus-visible:outline-none focus-visible:text-primary cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-xs font-medium text-destructive transition-all animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
