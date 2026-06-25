"use client";

import { useRouter } from "next/navigation";

import { usePostApiInterviewStart } from "@repo/kubb";

import type { InterviewSetupFormData } from "../schemas";
import type { InterviewStartResponse } from "../types";
import { mapInterviewSetupToRequest } from "../utils";

export function useStartInterview() {
  const router = useRouter();
  const { mutate: startInterview, isPending } = usePostApiInterviewStart();

  const submitInterviewSetup = (data: InterviewSetupFormData) => {
    startInterview(
      {
        data: mapInterviewSetupToRequest(data),
      },
      {
        onSuccess: (result) => {
          const startResult = result as InterviewStartResponse;
          const params = new URLSearchParams({
            interviewId: startResult.interviewId ?? "",
            accessToken: startResult.accessToken ?? "",
            configId: startResult.configId ?? "",
            questionCount: String(startResult.questionCount ?? 5),
          });

          router.push(`/interview/technical?${params.toString()}`);
        },
      },
    );
  };

  return {
    isSubmitting: isPending,
    submitInterviewSetup,
  };
}
