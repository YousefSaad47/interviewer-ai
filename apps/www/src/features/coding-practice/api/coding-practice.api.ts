import { apiClient } from "@/services/api-client";

import type {
  CodingRunInput,
  CodingRunResponse,
  CodingSubmissionPollResponse,
} from "../types";

export const runCode = (input: CodingRunInput) => {
  return apiClient<CodingRunResponse>("/api/coding/run", {
    method: "POST",
    json: input,
  });
};

export const getCodingSubmission = (submissionId: string) => {
  return apiClient<CodingSubmissionPollResponse>(
    `/api/coding/submissions/${submissionId}`,
  );
};
