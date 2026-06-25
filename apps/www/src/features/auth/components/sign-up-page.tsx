"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui";
import { useSignUp } from "../hooks";
import { type SignUpSubmitFormData, signUpSchema } from "../schemas";
import { AuthLayout } from "./auth-layout";
import { AuthInput } from "./auth-input";

export function SignUpPage() {
  const { signUp, signInSocial } = useSignUp();
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSubmitFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await signInSocial(provider);
    } finally {
      // Timeout fallback if redirect is slow
      setTimeout(() => setSocialLoading(null), 3000);
    }
  };

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full flex-col items-center gap-1 text-center mb-1">
        <h1 className="font-bold text-2xl sm:text-3xl text-foreground tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
          Join the Future
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium">
          Create your Interviewer.Ai account
        </p>
      </div>

      {/* Tab Switcher Segmented Control */}
      <div className="flex w-full flex-col items-center gap-5">
        <div className="grid grid-cols-2 p-1 bg-muted/40 dark:bg-black/30 border border-border/30 dark:border-white/[0.04] rounded-lg w-full max-w-[240px]">
          <Link
            href="/auth/signin"
            className="flex items-center justify-center py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45"
          >
            Sign in
          </Link>
          <div className="flex items-center justify-center py-1.5 text-xs font-semibold text-primary-foreground bg-primary rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.08)] select-none">
            Sign Up
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(signUp)} className="w-full flex flex-col gap-4">
          {/* Full Name */}
          <AuthInput
            {...register("fullName")}
            type="text"
            icon="user"
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            autoComplete="name"
            disabled={isSubmitting || socialLoading !== null}
          />

          {/* Email */}
          <AuthInput
            {...register("email")}
            type="email"
            icon="email"
            label="Email Address"
            placeholder="name@example.com"
            error={errors.email?.message}
            autoComplete="email"
            disabled={isSubmitting || socialLoading !== null}
          />

          {/* Password */}
          <AuthInput
            {...register("password")}
            type="password"
            icon="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="new-password"
            disabled={isSubmitting || socialLoading !== null}
          />

          {/* Confirm Password */}
          <AuthInput
            {...register("confirmPassword")}
            type="password"
            icon="password"
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            disabled={isSubmitting || socialLoading !== null}
          />

          {/* Primary Action Button */}
          <Button
            type="submit"
            disabled={isSubmitting || socialLoading !== null}
            className="w-full mt-2 gap-2 rounded-lg py-2.5 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_1px_2px_rgba(16,185,129,0.1),0_0_0_1px_rgba(255,255,255,0.08)_inset] cursor-pointer"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </Button>
        </form>
      </div>

      {/* Social Logins */}
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-3">
          <div className="relative flex py-2 items-center w-full">
            <div className="flex-grow border-t border-border/20 dark:border-white/[0.04]"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground/60 font-medium select-none">
              or continue with
            </span>
            <div className="flex-grow border-t border-border/20 dark:border-white/[0.04]"></div>
          </div>

          <div className="flex w-full items-center gap-3">
            {/* Google Login */}
            <button
              type="button"
              disabled={isSubmitting || socialLoading !== null}
              onClick={() => handleSocialSignIn("google")}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border/40 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] px-4 py-2 text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:border-border-interactive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {socialLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
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
              )}
              <span>Google</span>
            </button>

            {/* GitHub Login */}
            <button
              type="button"
              disabled={isSubmitting || socialLoading !== null}
              onClick={() => handleSocialSignIn("github")}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border/40 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] px-4 py-2 text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:border-border-interactive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {socialLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Github className="h-4 w-4 text-foreground shrink-0" />
              )}
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <span>Already have an account?</span>
          <Link
            href="/auth/signin"
            className="font-semibold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 rounded transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
