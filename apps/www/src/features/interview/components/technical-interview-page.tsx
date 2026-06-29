"use client";

import { Suspense, useEffect, useRef } from "react";

import { VoiceProvider } from "@humeai/voice-react";
import {
  Activity,
  Bot,
  Clock,
  Layers,
  Loader2,
  Mic,
  MicOff,
  Phone,
  Target,
  User,
} from "lucide-react";

import { Header } from "@/features/landing";
import { Button, Card } from "@/shared/ui";

import { useTechnicalInterviewSession } from "../hooks";

function InterviewContent() {
  const {
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
  } = useTechnicalInterviewSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transcriptMessageCount = transcriptMessages.length;

  useEffect(() => {
    if (transcriptMessageCount > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcriptMessageCount]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Dynamic Background Overlays */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] dark:opacity-[0.15]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/noise-texture.png')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 opacity-[0.2] dark:opacity-[0.4]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/mesh.svg')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute opacity-20 dark:opacity-40"
        style={{
          left: "-15%",
          top: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          filter: "blur(180px)",
        }}
      />
      <div
        className="pointer-events-none absolute opacity-15 dark:opacity-30"
        style={{
          right: "-10%",
          bottom: "10%",
          width: "45%",
          height: "45%",
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          filter: "blur(150px)",
        }}
      />

      <Header />

      <main className="relative mx-auto w-full max-w-[1400px] px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:px-12 lg:pt-32">
        {/* Top Floating Control Capsule */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/45 p-4 shadow-black/5 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-6 dark:shadow-black/20">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 font-semibold text-emerald-600 text-sm hover:bg-emerald-500/15 dark:text-emerald-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span>45-60 min</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 font-semibold text-blue-600 text-sm hover:bg-blue-500/15 dark:text-blue-400">
                <Target className="h-4 w-4 shrink-0" />
                <span>{questionCount} Questions</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isMuted ? unmute() : mute())}
                  className="h-10 gap-2 rounded-xl border-border bg-card/80 font-medium text-sm hover:border-primary/30"
                >
                  {isMuted ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-primary" />
                  )}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              )}
              {isConnected ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEnd}
                  className="h-10 gap-2 rounded-xl border border-red-500/20 bg-red-500/10 font-medium text-red-600 text-sm transition-all duration-300 hover:bg-red-500 hover:text-white dark:text-red-400"
                >
                  <Phone className="h-4 w-4 rotate-135" />
                  End Interview
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleStart}
                  disabled={status.value === "connecting"}
                  className="h-10 gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground text-sm shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/95 hover:shadow-primary/30 disabled:opacity-50"
                >
                  {status.value === "connecting" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  Start Interview
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar Card */}
        <div className="mb-6">
          <div className="rounded-2xl border border-border/40 bg-card/45 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                  <Activity className="h-4 w-4 text-primary" />
                  Interview Progress
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary text-xs">
                  {progress}% Complete
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60 dark:bg-zinc-800/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Chat Workspace */}
          <div className="w-full">
            <Card className="relative h-[500px] overflow-hidden rounded-3xl border-border/40 bg-card/45 shadow-2xl backdrop-blur-xl sm:h-[550px] lg:h-[627px]">
              {!isConnected && status.value !== "connecting" ? (
                <div className="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 px-6 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-2xl shadow-primary/5 transition-all duration-300 hover:scale-105">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
                      AI Mock Interviewer
                    </h2>
                    <p className="mx-auto max-w-md text-base text-muted-foreground">
                      Set up your microphone, click the start button above, and
                      practice answering real-time technical interview
                      questions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col p-5 sm:p-6">
                  {/* Styled Header */}
                  <div className="mb-4 flex items-center justify-between border-border/40 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                      </span>
                      <span className="font-semibold text-foreground text-sm tracking-wide">
                        Active Interview Session
                      </span>
                    </div>
                  </div>

                  {/* Message Container */}
                  <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {transcriptMessages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="font-medium text-muted-foreground text-sm">
                          {status.value === "connecting"
                            ? "Connecting..."
                            : "Speak to begin your interview..."}
                        </p>
                      </div>
                    ) : (
                      transcriptMessages.map((msg, i) => (
                        <div
                          key={`${msg.type}-${i}`}
                          className={`flex w-full ${
                            msg.type === "user_message"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[80%] flex-col gap-1 ${
                              msg.type === "user_message"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <span className="flex items-center gap-1 px-1 font-bold text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                              {msg.type === "user_message" ? (
                                <>
                                  You <User className="h-2.5 w-2.5" />
                                </>
                              ) : (
                                <>
                                  <Bot className="h-2.5 w-2.5" /> Interviewer
                                </>
                              )}
                            </span>
                            <div
                              className={`rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                                msg.type === "user_message"
                                  ? "rounded-tr-sm bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/10"
                                  : "rounded-tl-sm border border-border/40 bg-muted/60 text-foreground dark:bg-zinc-800/40"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.message?.content?.replace(
                                  "QUESTION_START",
                                  "",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {status.value === "connecting" && (
                      <div className="flex items-center justify-center gap-2 py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="font-medium text-muted-foreground text-sm">
                          Connecting to AI Interviewer...
                        </span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Session Overview Side Panel */}
          <div className="w-full">
            <Card className="rounded-3xl border-border/40 bg-card/45 p-6 shadow-xl backdrop-blur-xl xl:p-7">
              <h3 className="mb-6 flex items-center gap-2 border-border/40 border-b pb-3 font-bold text-foreground text-lg tracking-tight sm:text-xl">
                <Layers className="h-5 w-5 text-primary" />
                Session Overview
              </h3>

              <div className="flex flex-col gap-3.5">
                {[
                  {
                    label: "Total Questions",
                    value: questionCount,
                    style:
                      "text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20",
                    borderStyle: "border-l-blue-500",
                  },
                  {
                    label: "Completed",
                    value: currentQuestion,
                    style:
                      "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
                    borderStyle: "border-l-emerald-500",
                  },
                  {
                    label: "Remaining",
                    value: Math.max(0, questionCount - currentQuestion),
                    style:
                      "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20",
                    borderStyle: "border-l-cyan-500",
                  },
                  {
                    label: "Status",
                    value: isConnected ? "Active" : "Not Started",
                    style: isConnected
                      ? "text-primary bg-primary/10 border border-primary/20 font-bold animate-pulse"
                      : "text-slate-600 dark:text-slate-400 bg-slate-500/10 border border-slate-500/20 font-bold",
                    borderStyle: isConnected
                      ? "border-l-primary"
                      : "border-l-slate-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-xl border border-border/25 border-l-4 ${item.borderStyle} bg-card p-3.5 pl-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <span className="font-semibold text-muted-foreground text-sm">
                      {item.label}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1.5 font-bold text-sm shadow-sm ${item.style}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export function TechnicalInterviewPage() {
  return (
    <Suspense>
      <VoiceProvider>
        <InterviewContent />
      </VoiceProvider>
    </Suspense>
  );
}
