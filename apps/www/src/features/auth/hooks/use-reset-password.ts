"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { resetPassword } from "../api";
import type { ResetPasswordSubmitFormData } from "../schemas/reset-password.schema";

export function useResetPassword(token: string) {
  const router = useRouter();

  const submitResetPassword = async (data: ResetPasswordSubmitFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    const { error } = await resetPassword(data, token);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/auth/signin");
  };

  return { submitResetPassword };
}
