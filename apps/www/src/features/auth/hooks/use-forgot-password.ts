"use client";

import { useState } from "react";

import { toast } from "sonner";

import { requestPasswordReset } from "../api";
import type { ForgotPasswordSubmitFormData } from "../schemas/forgot-password.schema";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";

export function useForgotPassword() {
  const [sent, setSent] = useState(false);

  const sendResetLink = async (data: ForgotPasswordSubmitFormData) => {
    const { error } = await requestPasswordReset(
      data,
      getAuthCallbackUrl("/auth/reset-password"),
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  return { sent, sendResetLink };
}
