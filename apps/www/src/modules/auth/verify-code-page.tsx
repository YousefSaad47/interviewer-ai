"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth";

export function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      const { error } = await authClient.verifyEmail({
        query: {
          token,
          callbackURL: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    };

    verify();
  }, [token, router]);

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
