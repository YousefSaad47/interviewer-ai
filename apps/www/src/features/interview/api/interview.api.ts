import { apiClient } from "@/services/api-client";

import type { LinkInterviewChatInput } from "../types";

export const linkInterviewChat = (
  interviewId: string,
  input: LinkInterviewChatInput,
) => {
  return apiClient<{ success: boolean }>(
    `/api/interview/${interviewId}/link-chat`,
    {
      method: "POST",
      json: input,
    },
  );
};
