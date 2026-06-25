"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib";
import { Button, Input } from "@/shared/ui";

import { useForgotPassword } from "../hooks";
import {
  type ForgotPasswordSubmitFormData,
  forgotPasswordSchema,
} from "../schemas";
import { AuthLayout } from "./auth-layout";

export function ForgotPasswordPage() {
  const { sent, sendResetLink } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSubmitFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  if (sent) {
    return (
      <AuthLayout>
        <div className="flex w-full max-w-90 flex-col items-center gap-2.5 text-center sm:gap-3">
          <h1 className="font-bold text-3xl text-foreground sm:text-[35px]">
            Check Your Email
          </h1>
          <p className="font-light text-[13px] text-foreground sm:text-[16px]">
            We sent a password reset link to your email. Click the link to reset
            your password.
          </p>
          <Link
            href="/auth/signin"
            className="font-light text-[13px] text-primary hover:underline sm:text-[16px]"
          >
            Back to Sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-90 flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="w-full max-w-92.5 text-center font-bold text-3xl text-foreground leading-none tracking-[-2.5%] sm:text-[35px]">
          Forgot your Password?
        </h1>
        <p className="w-full max-w-83.75 text-center font-light text-[13px] text-foreground leading-[1.21em] tracking-[-2.5%] sm:text-[16px]">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <div className="flex w-full max-w-105 flex-col items-center gap-4 sm:gap-5">
        <form onSubmit={handleSubmit(sendResetLink)} className="w-full">
          <div className="flex w-full flex-col gap-4 sm:gap-5">
            {/* Email */}
            <div className="w-full">
              <div
                className={cn(
                  "relative flex w-full items-center rounded-xl border-0 border-b px-4 py-2.5 transition-colors sm:px-5 sm:py-3 dark:bg-surface-secondary",
                  errors.email
                    ? "border-destructive"
                    : "border-border focus-within:border-primary/45 dark:border-border dark:focus-within:border-border-interactive",
                )}
              >
                <Mail
                  className={cn(
                    "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                    errors.email ? "text-destructive" : "text-foreground/40",
                  )}
                />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="h-auto w-full border-0 bg-transparent! p-0 font-normal text-base text-foreground shadow-none outline-none ring-0 placeholder:font-medium placeholder:text-foreground/18 placeholder:text-sm placeholder:leading-none focus:placeholder:text-primary focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 font-medium text-destructive text-xs sm:text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex w-full flex-col gap-2 p-2 sm:mt-5 sm:gap-2.5 sm:p-2.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 rounded-xl px-6 py-2.5 font-medium text-base leading-[1.43em] shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
              size="lg"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex w-full max-w-105 flex-col items-center gap-6 sm:gap-7">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="font-light text-[11px] text-foreground leading-none tracking-[-2.5%] sm:text-[14px]">
            Remember your password?
          </span>
          <Link
            href="/auth/signin"
            className="font-light text-[11px] text-primary leading-none tracking-[-2.5%] transition-opacity hover:underline hover:opacity-80 sm:text-[14px]"
          >
            Back to Signin
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
