"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useVoice } from "@humeai/voice-react";
import { usePostApiInterviewIdFinalize } from "@repo/kubb";

import { linkInterviewChat } from "../api";

export function useTechnicalInterviewSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId") ?? "";
  const accessToken = searchParams.get("accessToken") ?? "";
  const configId = searchParams.get("configId") ?? "";
  const questionCount = Number.parseInt(
    searchParams.get("questionCount") ?? "5",
    10,
  );

  const [chatId, setChatId] = useState<string | null>(null);
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const { mutateAsync: finalizeInterview } = usePostApiInterviewIdFinalize();
  const { connect, disconnect, status, messages, isMuted, mute, unmute } =
    useVoice();

  const isConnected = status.value === "connected";

  const handleStart = useCallback(() => {
    connect({
      auth: { type: "accessToken", value: accessToken },
      ...(configId ? { configId } : {}),
    }).catch(() => {});
  }, [connect, accessToken, configId]);

  const handleEnd = useCallback(async () => {
    disconnect();

    if (chatId && interviewId) {
      await finalizeInterview({
        id: interviewId,
        data: { chatId, chatGroupId: chatGroupId ?? chatId },
      });
    }

    router.push("/dashboard");
  }, [disconnect, chatId, chatGroupId, interviewId, router, finalizeInterview]);

  useEffect(() => {
    const metadataMsg = messages.find((m) => m.type === "chat_metadata");
    if (metadataMsg?.type !== "chat_metadata" || !interviewId) return;

    setChatId(metadataMsg.chatId);
    setChatGroupId(metadataMsg.chatGroupId);

    linkInterviewChat(interviewId, {
      chatId: metadataMsg.chatId,
      chatGroupId: metadataMsg.chatGroupId,
    }).catch(() => {});
  }, [messages, interviewId]);

  useEffect(() => {
    const assistantMessages = messages.filter(
      (message) => message.type === "assistant_message",
    );
    let count = 0;

    for (const message of assistantMessages) {
      if (message.message?.content?.includes("QUESTION_START")) {
        count++;
      }
    }

    setCurrentQuestion(count);
  }, [messages]);

  const transcriptMessages = messages.filter(
    (message) =>
      message.type === "user_message" || message.type === "assistant_message",
  );

  const progress = Math.min(
    Math.round((currentQuestion / questionCount) * 100),
    100,
  );

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
