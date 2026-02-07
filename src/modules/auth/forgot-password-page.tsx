"use client";

import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthLayout, forgotPasswordSubmitSchema } from "@/modules/auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import type { ForgotPasswordSubmitFormData } from "@/modules/auth";

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSubmitFormData>({
    resolver: zodResolver(forgotPasswordSubmitSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordSubmitFormData) => {
    console.log("Form data:", data);
    // TODO: Implement actual forgot password logic
  };

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-90 flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="text-foreground w-full max-w-92.5 text-center text-3xl leading-none font-bold tracking-[-2.5%] sm:text-[35px]">
          Forgot your Password?
        </h1>
        <p className="text-foreground w-full max-w-83.75 text-center text-[13px] leading-[1.21em] font-light tracking-[-2.5%] sm:text-[16px]">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <div className="flex w-full max-w-105 flex-col items-center gap-4 sm:gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex w-full flex-col gap-4 sm:gap-5">
            {/* Email */}
            <div className="w-full">
              <div
                className={cn(
                  "relative flex w-full items-center rounded-xl border-0 border-b bg-neutral-100 px-4 py-2.5 transition-colors sm:px-5 sm:py-3 dark:bg-neutral-800",
                  errors.email
                    ? "border-destructive"
                    : "border-neutral-300 focus-within:border-neutral-400 dark:border-neutral-700 dark:focus-within:border-neutral-600"
                )}
              >
                <Mail
                  className={cn(
                    "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                    errors.email ? "text-destructive" : "text-foreground/40"
                  )}
                />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="text-foreground placeholder:text-foreground/18 focus:placeholder:text-primary h-auto w-full border-0 bg-transparent! p-0 text-base font-normal shadow-none ring-0 outline-none placeholder:text-sm placeholder:leading-none placeholder:font-medium focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
                />
              </div>
              {errors.email && (
                <p className="text-destructive mt-1.5 text-xs font-medium sm:text-sm">
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
              className="w-full gap-2 rounded-xl px-6 py-2.5 text-base leading-[1.43em] font-medium shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
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
          <span className="text-foreground text-[11px] leading-none font-light tracking-[-2.5%] sm:text-[14px]">
            Remember your password?
          </span>
          <Link
            href="/auth/signin"
            className="text-primary text-[11px] leading-none font-light tracking-[-2.5%] transition-opacity hover:underline hover:opacity-80 sm:text-[14px]"
          >
            Back to Signin
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
