"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useVoice } from "@humeai/voice-react";
import { usePostApiInterviewIdFinalize } from "@repo/kubb";

import { linkInterviewChat } from "../api";
import {
  calculateInterviewProgress,
  parseInterviewQuestionCount,
} from "../utils";

export function useTechnicalInterviewSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId") ?? "";
  const accessToken = searchParams.get("accessToken") ?? "";
  const configId = searchParams.get("configId") ?? "";
  const questionCount = parseInterviewQuestionCount(
    searchParams.get("questionCount"),
  );
  const linkedChatIdRef = useRef<string | null>(null);

  const { mutateAsync: finalizeInterview } = usePostApiInterviewIdFinalize();
  const { connect, disconnect, status, messages, isMuted, mute, unmute } =
    useVoice();

  const isConnected = status.value === "connected";
  const chatMetadata = useMemo(
    () => messages.find((message) => message.type === "chat_metadata"),
    [messages],
  );
  const currentQuestion = useMemo(
    () =>
      messages.reduce((count, message) => {
        if (
          message.type === "assistant_message" &&
          message.message?.content?.includes("QUESTION_START")
        ) {
          return count + 1;
        }

        return count;
      }, 0),
    [messages],
  );
  const transcriptMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.type === "user_message" ||
          message.type === "assistant_message",
      ),
    [messages],
  );
  const progress = calculateInterviewProgress(currentQuestion, questionCount);

  const handleStart = useCallback(() => {
    connect({
      auth: { type: "accessToken", value: accessToken },
      ...(configId ? { configId } : {}),
    }).catch(() => {});
  }, [connect, accessToken, configId]);

  const handleEnd = useCallback(async () => {
    disconnect();

    if (chatMetadata?.type === "chat_metadata" && interviewId) {
      await finalizeInterview({
        id: interviewId,
        data: {
          chatId: chatMetadata.chatId,
          chatGroupId: chatMetadata.chatGroupId ?? chatMetadata.chatId,
        },
      });
    }

    router.push("/dashboard");
  }, [disconnect, chatMetadata, interviewId, router, finalizeInterview]);

  useEffect(() => {
    if (
      chatMetadata?.type !== "chat_metadata" ||
      !interviewId ||
      linkedChatIdRef.current === chatMetadata.chatId
    ) {
      return;
    }

    linkInterviewChat(interviewId, {
      chatId: chatMetadata.chatId,
      chatGroupId: chatMetadata.chatGroupId,
    }).catch(() => {});

    linkedChatIdRef.current = chatMetadata.chatId;
  }, [chatMetadata, interviewId]);

  return {
    currentQuestion,
    handleEnd,
    handleStart,
    isConnected,
    isMuted,
    mute,
    progress,
    questionCount,
    status,
    transcriptMessages,
    unmute,
  };
}
