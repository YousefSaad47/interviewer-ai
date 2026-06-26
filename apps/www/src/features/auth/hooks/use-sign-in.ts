"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmail, signInWithSocial } from "../api";
import type { SignInSubmitFormData } from "../schemas/sign-in.schema";
import type { AuthProvider } from "../types/auth.types";
import { getAuthCallbackUrl } from "../utils/auth-callback-url";
import { normalizeAuthError } from "../utils/auth-error-normalizer";

export function useSignIn() {
  const router = useRouter();

  const signIn = async (data: SignInSubmitFormData) => {
    try {
      const result = await signInWithEmail(data);

      if (result?.error) {
        const normalized = normalizeAuthError(result.error);
        toast.error(normalized.title, {
          description: normalized.description,
        });
        return { success: false };
      }

      toast.success("Welcome back", {
        description: "You have signed in successfully.",
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

  return { signIn, signInSocial };
}
