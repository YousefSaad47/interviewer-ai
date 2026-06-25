"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { signInWithSocial, signUpWithEmail } from "../api";
import type { SignUpSubmitFormData } from "../schemas/sign-up.schema";
import type { AuthProvider } from "../types/auth.types";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";

export function useSignUp() {
  const router = useRouter();

  const signUp = async (data: SignUpSubmitFormData) => {
    const { data: result, error } = await signUpWithEmail(
      data,
      getAuthCallbackUrl("/dashboard"),
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!result?.token) {
      toast.success("Check your email for verification.");
      router.push("/auth/signin");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const signInSocial = (provider: AuthProvider) => {
    return signInWithSocial(provider, getAuthCallbackUrl("/dashboard"));
  };

  return { signUp, signInSocial };
}
