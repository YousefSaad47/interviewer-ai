"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { signInWithEmail, signInWithSocial } from "../api";
import type { SignInSubmitFormData } from "../schemas/sign-in.schema";
import type { AuthProvider } from "../types/auth.types";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";

export function useSignIn() {
  const router = useRouter();

  const signIn = async (data: SignInSubmitFormData) => {
    const { error } = await signInWithEmail(data);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const signInSocial = (provider: AuthProvider) => {
    return signInWithSocial(provider, getAuthCallbackUrl("/dashboard"));
  };

  return { signIn, signInSocial };
}
