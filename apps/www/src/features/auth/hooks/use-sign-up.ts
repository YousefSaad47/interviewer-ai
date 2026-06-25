"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithSocial, signUpWithEmail } from "../api";
import type { SignUpSubmitFormData } from "../schemas/sign-up.schema";
import type { AuthProvider } from "../types/auth.types";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";
import { normalizeAuthError } from "../utils/auth-error-normalizer";

export function useSignUp() {
  const router = useRouter();

  const signUp = async (data: SignUpSubmitFormData) => {
    try {
      const { data: result, error } = await signUpWithEmail(
        data,
        getAuthCallbackUrl("/dashboard"),
      );

      if (error) {
        const normalized = normalizeAuthError(error);
        toast.error(normalized.title, {
          description: normalized.description,
        });
        return { success: false };
      }

      if (!result?.token) {
        toast.success("Account created", {
          description: "Please check your email to verify your account.",
        });
        router.push("/auth/signin");
        return { success: true };
      }

      toast.success("Welcome to Interviewer.Ai", {
        description: "Your account has been created successfully.",
      });

      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch (err) {
      const normalized = normalizeAuthError(err);
      toast.error(normalized.title, {
        description: normalized.description,
      });
      return { success: false };
    }
  };

  const signInSocial = async (provider: AuthProvider) => {
    try {
      await signInWithSocial(provider, getAuthCallbackUrl("/dashboard"));
    } catch (err) {
      const normalized = normalizeAuthError(err);
      toast.error(normalized.title, {
        description: normalized.description,
      });
    }
  };

  return { signUp, signInSocial };
}
