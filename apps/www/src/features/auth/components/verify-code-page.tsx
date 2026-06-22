"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useVerifyEmail } from "../hooks";
import { AuthLayout } from "./auth-layout";

export function VerifyCodePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  useVerifyEmail(token);

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex w-full max-w-90 flex-col items-center gap-2.5 text-center sm:gap-3">
          <h1 className="font-bold text-3xl text-foreground sm:text-[35px]">
            Invalid Link
          </h1>
          <p className="font-light text-[13px] text-foreground sm:text-[16px]">
            This verification link is invalid or expired. Please sign up again
            or request a new verification email.
          </p>
          <Link
            href="/auth/signup"
            className="font-light text-[13px] text-primary hover:underline sm:text-[16px]"
          >
            Back to Sign Up
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-90 flex-col items-center gap-2.5 text-center sm:gap-3">
        <h1 className="font-bold text-3xl text-foreground sm:text-[35px]">
          Verifying Your Email
        </h1>
        <p className="font-light text-[13px] text-foreground sm:text-[16px]">
          Please wait while we verify your email address...
        </p>
      </div>
    </AuthLayout>
  );
}
