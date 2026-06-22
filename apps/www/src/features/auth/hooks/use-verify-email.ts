"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { verifyEmail } from "../api";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";

export function useVerifyEmail(token: string) {
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const runVerification = async () => {
      const { error } = await verifyEmail(
        token,
        getAuthCallbackUrl("/dashboard"),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    };

    runVerification();
  }, [token, router]);
}
