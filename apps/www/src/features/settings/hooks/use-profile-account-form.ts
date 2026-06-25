"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authClient } from "@/services";

import { type ProfileAccountFormData, profileAccountSchema } from "../schemas";

const emptyProfile: ProfileAccountFormData = {
  fullName: "",
  email: "",
  phone: "",
  currentRole: "",
  targetRole: "",
  experience: "",
};

export function useProfileAccountForm() {
  const { data: session } = authClient.useSession();
  const form = useForm<ProfileAccountFormData>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: emptyProfile,
  });

  useEffect(() => {
    if (!session?.user) return;

    form.reset({
      ...emptyProfile,
      fullName: session.user.name ?? "",
      email: session.user.email ?? "",
    });
  }, [form, session?.user]);

  const onSubmit = async (_data: ProfileAccountFormData) => {
    // TODO(settings-api): Persist profile/professional fields when a backend settings endpoint exists.
    await Promise.resolve();
  };

  return { ...form, onSubmit };
}
