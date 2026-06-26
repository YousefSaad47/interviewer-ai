"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type InterviewSetupFormData, interviewSetupSchema } from "../schemas";
import { useStartInterview } from "./use-start-interview";

const defaultValues: InterviewSetupFormData = {
  targetRole: "",
  experienceLevel: "",
  interviewFocus: "",
  additionalContext: "",
};

export function useInterviewSetupForm() {
  const form = useForm<InterviewSetupFormData>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues,
  });
  const { isSubmitting, submitInterviewSetup } = useStartInterview();

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting,
    onSubmit: form.handleSubmit(submitInterviewSetup),
    register: form.register,
  };
}
