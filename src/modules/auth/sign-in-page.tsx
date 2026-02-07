"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { AuthLayout, signInSubmitSchema } from "@/modules/auth";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";

import type { SignInSubmitFormData } from "@/modules/auth";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignInSubmitFormData>({
    resolver: zodResolver(signInSubmitSchema),
    mode: "onSubmit",
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: SignInSubmitFormData) => {
    console.log("Form data:", data);
    // TODO: Implement actual signin logic
  };

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-75 flex-col items-center gap-1.5 sm:gap-2">
        <h1 className="text-foreground text-center text-3xl leading-none font-bold tracking-[-2.5%] sm:text-[40px]">
          Welcome Back!
        </h1>
        <p className="text-foreground w-full text-center text-base leading-none font-light tracking-[-2.5%] sm:text-[17px]">
          Sign in with your Account
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex w-full max-w-105 flex-col items-center gap-4 sm:gap-5">
        <div className="flex h-8 w-full max-w-65 items-center justify-between gap-1 rounded-[9px] bg-neutral-100 p-1.5 dark:bg-neutral-800">
          <div className="bg-primary flex items-center justify-center gap-1 rounded-md px-8 py-2 sm:px-10 sm:py-2.5">
            <span className="text-foreground text-[10px] leading-none font-medium tracking-[-2.5%] sm:text-[11px]">
              Sign in
            </span>
          </div>
          <Link
            href="/auth/signup"
            className="text-foreground hover:bg-primary/5 hover:text-foreground flex items-center justify-center gap-1 rounded-md px-8 py-2 transition-all sm:px-10 sm:py-2.5"
          >
            <span className="text-[10px] leading-none font-medium tracking-[-2.5%] sm:text-[11px]">
              Sign Up
            </span>
          </Link>
        </div>

        {/* Form */}
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

            {/* Password */}
            <div className="w-full">
              <div
                className={cn(
                  "relative flex w-full items-center rounded-xl border-0 border-b bg-neutral-100 px-4 py-2.5 transition-colors sm:px-5 sm:py-3 dark:bg-neutral-800",
                  errors.password
                    ? "border-destructive"
                    : "border-neutral-300 focus-within:border-neutral-400 dark:border-neutral-700 dark:focus-within:border-neutral-600"
                )}
              >
                <Lock
                  className={cn(
                    "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                    errors.password ? "text-destructive" : "text-foreground/40"
                  )}
                />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="text-foreground placeholder:text-foreground/18 focus:placeholder:text-primary h-auto w-full border-0 bg-transparent! p-0 text-base font-normal shadow-none ring-0 outline-none placeholder:text-sm placeholder:leading-none placeholder:font-medium focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
                />
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
              </div>
              {errors.password && (
                <p className="text-destructive mt-1.5 text-xs font-medium sm:text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button & Options */}
          <div className="mt-4 flex w-full flex-col gap-2 p-2 sm:mt-5 sm:gap-2.5 sm:p-2.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 rounded-xl px-6 py-2.5 text-base leading-[1.43em] font-medium shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
              size="lg"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center sm:gap-50">
              <label className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90 sm:gap-2.5">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setValue("rememberMe", checked === true)
                  }
                  className="border-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary h-3.5 w-3.5 rounded-sm sm:h-4 sm:w-4"
                />
                <span className="text-foreground text-[10px] leading-[1.91em] font-medium sm:text-[11px]">
                  Remember me
                </span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-foreground hover:text-primary text-[10px] leading-[1.91em] font-medium transition-all hover:underline sm:text-[11px]"
              >
                Forget Password?
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* Social Login & Footer */}
      <div className="flex w-full max-w-105 flex-col items-center gap-6 sm:gap-7">
        <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:gap-3">
          <p className="text-foreground w-full text-center text-base leading-none font-light tracking-[-2.5%] sm:text-[17px]">
            or continue with
          </p>

          <div className="flex w-full items-center gap-4 sm:gap-4.5">
            <button
              type="button"
              className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] px-5 py-2 shadow-[0px_0.92px_1.84px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] focus:ring-2 focus:outline-none active:scale-95 sm:h-9.5 sm:gap-2.5 sm:px-8 sm:py-3"
            >
              <Github className="text-foreground h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] leading-[1.43em] font-medium text-[#FAFAFA] sm:text-[12px]">
                GitHub
              </span>
            </button>
            <button
              type="button"
              className="border-primary hover:bg-primary/10 focus:ring-primary/50 flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] border bg-transparent px-5 py-2 shadow-[0px_0.92px_1.84px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] focus:ring-2 focus:outline-none active:scale-95 sm:h-9.5 sm:gap-2.5 sm:px-8 sm:py-3"
            >
              <Github className="text-foreground h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] leading-[1.43em] font-medium text-[#FAFAFA] sm:text-[12px]">
                GitHub
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="text-foreground text-[11px] leading-none font-light tracking-[-2.5%] sm:text-[14px]">
            Don&apos;t Have Account?
          </span>
          <Link
            href="/auth/signup"
            className="text-primary hover:text-primary/80 text-[11px] leading-none font-light tracking-[-2.5%] transition-all hover:underline sm:text-[14px]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
