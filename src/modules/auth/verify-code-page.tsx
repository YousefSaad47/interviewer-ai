"use client";

import { Controller, useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AuthLayout,
  CodeDigitInput,
  verifyCodeSubmitSchema,
} from "@/modules/auth";
import { Button } from "@/shared/components/ui/button";

import type { VerifyCodeSubmitFormData } from "@/modules/auth";

export function VerifyCodePage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeSubmitFormData>({
    resolver: zodResolver(verifyCodeSubmitSchema),
    mode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyCodeSubmitFormData) => {
    console.log("Form data:", data);
    // TODO: Implement actual verification logic
  };

  return (
    <AuthLayout>
      {/* Title Section */}
      <div className="flex w-full max-w-[360px] flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="text-foreground w-full max-w-[370px] text-center text-3xl leading-none font-bold tracking-[-2.5%] sm:text-[35px]">
          Verify Your Code
        </h1>
        <p className="text-foreground w-full max-w-[335px] text-center text-[13px] leading-[1.21em] font-light tracking-[-2.5%] sm:text-[16px]">
          Enter the 6-digit code sent to your email or authenticator app.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[420px]">
        {/* Code Input */}
        <div className="flex w-full flex-col items-center gap-4 sm:gap-5">
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <CodeDigitInput
                value={field.value}
                onChange={field.onChange}
                length={6}
                error={errors.code?.message}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex w-full flex-col gap-2 p-2 sm:mt-5 sm:gap-2.5 sm:p-2.5">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gap-2 rounded-xl px-6 py-2.5 text-base leading-[1.43em] font-medium shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
            size="lg"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="flex w-full max-w-[420px] flex-col items-center gap-6 sm:gap-[28px]">
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
