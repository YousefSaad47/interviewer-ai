"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthLayout, resetPasswordSubmitSchema } from "@/modules/auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import type { ResetPasswordSubmitFormData } from "@/modules/auth";

export function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSubmitFormData>({
    resolver: zodResolver(resetPasswordSubmitSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordSubmitFormData) => {
    console.log("Form data:", data);
    // TODO: Implement actual reset password logic
  };

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-90 flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="text-foreground w-full max-w-92.5 text-center text-3xl leading-none font-bold tracking-[-2.5%] sm:text-[35px]">
          Reset Password
        </h1>
        <p className="text-foreground w-full max-w-83.75 text-center text-[13px] leading-[1.21em] font-light tracking-[-2.5%] sm:text-[16px]">
          Enter your new password below to regain access to your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-105">
        <div className="flex w-full flex-col gap-4 sm:gap-5">
          {/* New Password */}
          <div className="w-full">
            <div
              className={cn(
                "bg-card relative flex w-full items-center rounded-xl border-0 border-b px-4 py-2.5 transition-colors sm:px-5 sm:py-3",
                errors.newPassword
                  ? "border-destructive"
                  : "border-primary/50 focus-within:border-primary"
              )}
            >
              <Lock
                className={cn(
                  "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                  errors.newPassword ? "text-destructive" : "text-foreground/40"
                )}
              />
              <Input
                {...register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="text-foreground placeholder:text-foreground/18 focus:placeholder:text-primary h-auto w-full border-0 bg-transparent! p-0 text-base font-normal shadow-none ring-0 outline-none placeholder:text-sm placeholder:leading-none placeholder:font-medium focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-foreground/60 hover:text-foreground ml-1.5 h-5 w-5 shrink-0 transition-all hover:scale-110 sm:ml-2 sm:h-6 sm:w-6"
              >
                {showNewPassword ? (
                  <EyeOff className="h-full w-full" />
                ) : (
                  <Eye className="h-full w-full" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-destructive mt-1.5 text-xs font-medium sm:text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <div
              className={cn(
                "bg-card relative flex w-full items-center rounded-xl border-0 border-b px-4 py-2.5 transition-colors sm:px-5 sm:py-3",
                errors.confirmPassword
                  ? "border-destructive"
                  : "border-primary/50 focus-within:border-primary"
              )}
            >
              <Lock
                className={cn(
                  "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                  errors.confirmPassword
                    ? "text-destructive"
                    : "text-foreground/40"
                )}
              />
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="text-foreground placeholder:text-foreground/18 focus:placeholder:text-primary h-auto w-full border-0 bg-transparent! p-0 text-base font-normal shadow-none ring-0 outline-none placeholder:text-sm placeholder:leading-none placeholder:font-medium focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-foreground/60 hover:text-foreground ml-1.5 h-5 w-5 shrink-0 transition-all hover:scale-110 sm:ml-2 sm:h-6 sm:w-6"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-full w-full" />
                ) : (
                  <Eye className="h-full w-full" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive mt-1.5 text-xs font-medium sm:text-sm">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>

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
