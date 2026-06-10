"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { VerifyCodeSubmitFormData } from "@/modules/auth";
import {
  AuthLayout,
  CodeDigitInput,
  verifyCodeSubmitSchema,
} from "@/modules/auth";
import { Button } from "@/shared/components/ui/button";

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
      <div className="flex w-full max-w-90 flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="w-full max-w-92.5 text-center font-bold text-3xl text-foreground leading-none tracking-[-2.5%] sm:text-[35px]">
          Verify Your Email
        </h1>
        <p className="w-full max-w-83.75 text-center font-light text-[13px] text-foreground leading-[1.21em] tracking-[-2.5%] sm:text-[16px]">
          Enter the 6-digit code sent to your email or authenticator app.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-105">
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
            className="w-full gap-2 rounded-xl px-6 py-2.5 font-medium text-base leading-[1.43em] shadow-[0px_1.11px_2.21px_0px_rgba(26,26,26,0.05)] transition-all hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-50 sm:px-10 sm:py-3 sm:text-[17px]"
            size="lg"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </form>

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
