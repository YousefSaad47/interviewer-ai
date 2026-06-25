"use client";

import { useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib";
import { Button, Checkbox, Input } from "@/shared/ui";

import { useSignIn } from "../hooks";
import { type SignInSubmitFormData, signInSchema } from "../schemas";
import { AuthLayout } from "./auth-layout";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInSocial } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignInSubmitFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-75 flex-col items-center gap-1.5 sm:gap-2">
        <h1 className="text-center font-bold text-3xl text-foreground leading-none tracking-[-2.5%] sm:text-[40px]">
          Welcome Back!
        </h1>
        <p className="w-full text-center font-light text-base text-foreground leading-none tracking-[-2.5%] sm:text-[17px]">
          Sign in with your Account
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex w-full max-w-105 flex-col items-center gap-4 sm:gap-5">
        <div className="flex h-8 w-full max-w-65 items-center justify-between gap-1 rounded-[9px] bg-card p-1.5 dark:bg-surface-secondary">
          <div className="flex items-center justify-center gap-1 rounded-md bg-primary px-8 py-2 sm:px-10 sm:py-2.5">
            <span className="font-medium text-[10px] text-foreground leading-none tracking-[-2.5%] sm:text-[11px]">
              Sign in
            </span>
          </div>
          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-1 rounded-md px-8 py-2 text-foreground transition-all hover:bg-primary/5 hover:text-foreground sm:px-10 sm:py-2.5"
          >
            <span className="font-medium text-[10px] leading-none tracking-[-2.5%] sm:text-[11px]">
              Sign Up
            </span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(signIn)} className="w-full">
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

            {/* Password */}
            <div className="w-full">
              <div
                className={cn(
                  "relative flex w-full items-center rounded-xl border-0 border-b px-4 py-2.5 transition-colors sm:px-5 sm:py-3 dark:bg-surface-secondary",
                  errors.password
                    ? "border-destructive"
                    : "border-border focus-within:border-primary/45 dark:border-border dark:focus-within:border-border-interactive",
                )}
              >
                <Lock
                  className={cn(
                    "mr-1.5 h-5 w-5 shrink-0 transition-colors sm:mr-2 sm:h-6 sm:w-6",
                    errors.password ? "text-destructive" : "text-foreground/40",
                  )}
                />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-auto w-full border-0 bg-transparent! p-0 font-normal text-base text-foreground shadow-none outline-none ring-0 placeholder:font-medium placeholder:text-foreground/18 placeholder:text-sm placeholder:leading-none focus:placeholder:text-primary focus-visible:border-0 focus-visible:ring-0 sm:text-lg sm:placeholder:text-[15px] dark:bg-transparent!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-1.5 h-5 w-5 shrink-0 text-foreground/60 transition-all hover:scale-110 hover:text-foreground sm:ml-2 sm:h-6 sm:w-6"
                >
                  {showPassword ? (
                    <EyeOff className="h-full w-full" />
                  ) : (
                    <Eye className="h-full w-full" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 font-medium text-destructive text-xs sm:text-sm">
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
              className="w-full gap-2 rounded-xl px-6 py-2.5 font-medium text-base leading-[1.43em] shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
              size="lg"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center sm:gap-50">
              <label
                htmlFor="remember-me"
                className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90 sm:gap-2.5"
              >
                <Checkbox
                  id="remember-me"
                  checked={rememberMe ?? false}
                  onCheckedChange={(checked) =>
                    setValue("rememberMe", checked === true)
                  }
                  className="h-3.5 w-3.5 rounded-sm border-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary sm:h-4 sm:w-4"
                />
                <span className="font-medium text-[10px] text-foreground leading-[1.91em] sm:text-[11px]">
                  Remember me
                </span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="font-medium text-[10px] text-foreground leading-[1.91em] transition-all hover:text-primary hover:underline sm:text-[11px]"
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
          <p className="w-full text-center font-light text-base text-foreground leading-none tracking-[-2.5%] sm:text-[17px]">
            or continue with
          </p>

          <div className="flex w-full items-center gap-4 sm:gap-4.5">
            <button
              type="button"
              onClick={() => signInSocial("google")}
              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 py-2 shadow-[0px_0.92px_1.84px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] hover:bg-primary/90 focus:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 sm:h-9.5 sm:gap-2.5 sm:px-8 sm:py-3"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                />
              </svg>
              <span className="font-medium text-[#FAFAFA] text-[10px] leading-[1.43em] sm:text-[12px]">
                Google
              </span>
            </button>
            <button
              type="button"
              onClick={() => signInSocial("github")}
              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] border border-primary bg-transparent px-5 py-2 shadow-[0px_0.92px_1.84px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] hover:bg-primary/10 focus:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 sm:h-9.5 sm:gap-2.5 sm:px-8 sm:py-3"
            >
              <Github className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
              <span className="font-medium text-[#FAFAFA] text-[10px] leading-[1.43em] sm:text-[12px]">
                GitHub
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="font-light text-[11px] text-foreground leading-none tracking-[-2.5%] sm:text-[14px]">
            Don&apos;t Have Account?
          </span>
          <Link
            href="/auth/signup"
            className="font-light text-[11px] text-primary leading-none tracking-[-2.5%] transition-all hover:text-primary/80 hover:underline sm:text-[14px]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
