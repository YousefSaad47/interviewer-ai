import type { PostApiInterviewStartMutationRequest } from "@repo/kubb";

export type InterviewCategory =
  PostApiInterviewStartMutationRequest["category"];
export type InterviewDifficulty = NonNullable<
  PostApiInterviewStartMutationRequest["difficulty"]
>;

export interface InterviewStartResponse {
  interviewId: string;
  accessToken: string;
  configId: string;
  questionCount: number;
}

export interface LinkInterviewChatInput {
  chatId: string;
  chatGroupId: string;
}
