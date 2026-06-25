import { authClient } from "@/services";

import type { ForgotPasswordSubmitFormData } from "../schemas/forgot-password.schema";
import type { ResetPasswordSubmitFormData } from "../schemas/reset-password.schema";
import type { SignInSubmitFormData } from "../schemas/sign-in.schema";
import type { SignUpSubmitFormData } from "../schemas/sign-up.schema";
import type { AuthProvider } from "../types/auth.types";

export const signInWithEmail = (data: SignInSubmitFormData) => {
  return authClient.signIn.email({
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe,
  });
};

export const signUpWithEmail = (
  data: SignUpSubmitFormData,
  callbackURL: string,
) => {
  return authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.fullName,
    callbackURL,
  });
};

export const signInWithSocial = (
  provider: AuthProvider,
  callbackURL: string,
) => {
  return authClient.signIn.social({
    provider,
    callbackURL,
  });
};

export const requestPasswordReset = (
  data: ForgotPasswordSubmitFormData,
  redirectTo: string,
) => {
  return authClient.requestPasswordReset({
    email: data.email,
    redirectTo,
  });
};

export const resetPassword = (
  data: ResetPasswordSubmitFormData,
  token: string,
) => {
  return authClient.resetPassword({
    newPassword: data.newPassword,
    token,
  });
};

export const verifyEmail = (token: string, callbackURL: string) => {
  return authClient.verifyEmail({
    query: {
      token,
      callbackURL,
    },
  });
};
