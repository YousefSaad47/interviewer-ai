"use client";

import { forwardRef, useState } from "react";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/shared/components/ui/input";

import type { InputHTMLAttributes } from "react";

export interface AuthInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  icon?: "user" | "email" | "password";
  label?: string;
  type?: "text" | "email" | "password";
  error?: string;
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
      <div className="w-full">
        <div
          className={cn(
            "relative flex w-full items-center rounded-xl border-0 border-b bg-neutral-100 px-4 py-2.5 transition-colors sm:px-5 sm:py-3 dark:bg-neutral-800",
            error
              ? "border-destructive"
              : isFocused
                ? "border-neutral-400 dark:border-neutral-600"
                : "border-neutral-300 dark:border-neutral-700",
            className
          )}
        >
          {/* Icon */}
          {icon && (
            <div className="mr-1.5 h-5 w-5 shrink-0 sm:mr-2 sm:h-6 sm:w-6">
              <IconComponent
                className={cn(
                  "h-full w-full transition-colors",
                  error
                    ? "text-destructive"
                    : isFocused
                      ? "text-primary"
                      : "text-foreground/40"
                )}
              />
            </div>
          )}

          {/* Input */}
          <Input
            ref={ref}
            type={inputType}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            className={cn(
              "text-foreground placeholder:text-foreground/18 h-auto w-full border-0 !bg-transparent p-0 text-base font-normal shadow-none ring-0 outline-none focus-visible:border-0 focus-visible:ring-0 sm:text-lg dark:!bg-transparent",
              "placeholder:text-sm placeholder:leading-none placeholder:font-medium sm:placeholder:text-[15px]",
              isFocused && "placeholder:text-primary"
            )}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-foreground/60 hover:text-foreground ml-1.5 h-5 w-5 shrink-0 transition-all hover:scale-110 sm:ml-2 sm:h-6 sm:w-6"
            >
              {showPassword ? (
                <EyeOff className="h-full w-full" />
              ) : (
                <Eye className="h-full w-full" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-destructive mt-1.5 text-xs font-medium sm:text-sm">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
