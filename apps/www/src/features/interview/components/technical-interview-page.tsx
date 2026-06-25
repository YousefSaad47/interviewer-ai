"use client";

import { VoiceProvider } from "@humeai/voice-react";
import { Clock, Loader2, Mic, MicOff, Phone, Target } from "lucide-react";

import { Header } from "@/features/landing/components/header";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

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

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 opacity-0 dark:opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/noise-texture.png')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 opacity-0 dark:opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/mesh.svg')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <Header />

      <main className="relative px-4 pt-24 pb-20 sm:px-6 md:px-8 lg:px-20 lg:pt-32">
        <div className="mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:gap-7">
          <div className="w-full lg:flex-1">
            <div className="flex flex-col gap-4 rounded-3xl bg-white/75 p-4 shadow-lg backdrop-blur-sm sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:rounded-[40px] lg:p-8 dark:bg-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:gap-6 lg:gap-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 sm:px-5 sm:py-3">
                    <Clock className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      45-60 min
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 sm:px-5 sm:py-3">
                    <Target className="h-7 w-7 text-primary sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      {questionCount} Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isMuted ? unmute() : mute())}
                    className="gap-2"
                  >
                    {isMuted ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                )}
                {isConnected ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEnd}
                    className="gap-2"
                  >
                    <Phone className="h-4 w-4 rotate-135" />
                    End Interview
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleStart}
                    disabled={status.value === "connecting"}
                    className="gap-2"
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

            <Card className="mt-6 rounded-3xl border-primary/20 bg-white/75 p-6 backdrop-blur-sm lg:rounded-[40px] lg:p-8 dark:bg-card">
              <div className="flex w-full flex-col gap-4 lg:gap-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base text-foreground sm:text-lg">
                    Interview Progress
                  </span>
                  <span className="font-medium text-base text-foreground sm:text-lg">
                    {progress}% Complete
                  </span>
                </div>
                <div className="relative h-2.5 w-full">
                  <div className="h-full w-full rounded-full bg-muted" />
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-6 lg:flex-1 lg:gap-7">
            <Card className="relative h-[500px] overflow-hidden rounded-2xl border-border/10 bg-white/75 backdrop-blur-sm sm:h-[550px] lg:h-[627px] lg:rounded-3xl dark:bg-card">
              {!isConnected && status.value !== "connecting" ? (
                <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 px-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-center font-bold text-2xl text-foreground sm:text-3xl lg:text-[28px]">
                    AI Mock Interview
                  </h2>
                  <p className="text-center text-base text-muted-foreground sm:text-lg">
                    Press Start Interview to begin your practice session
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col p-4 sm:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-foreground text-sm">
                      AI Interviewer
                    </span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    {transcriptMessages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground text-sm">
                          {status.value === "connecting"
                            ? "Connecting..."
                            : "Speak to begin your interview..."}
                        </p>
                      </div>
                    ) : (
                      transcriptMessages.map((msg, i) => (
                        <div
                          key={`${msg.type}-${i}`}
                          className={`flex ${msg.type === "user_message" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.type === "user_message"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-xs opacity-70">
                              {msg.type === "user_message"
                                ? "You"
                                : "Interviewer"}
                            </p>
                            <p className="text-sm">{msg.message?.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {status.value === "connecting" && (
                      <div className="flex items-center justify-center gap-2 py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          Connecting to AI Interviewer...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="w-full lg:w-80 xl:w-96">
            <Card className="rounded-2xl border-border bg-white/75 px-6 pt-6 pb-1 backdrop-blur-sm lg:rounded-3xl dark:border-border dark:bg-card">
              <h3 className="mb-10 font-bold text-foreground text-lg sm:mb-12 sm:text-xl lg:mb-14">
                Session Overview
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-border/20 border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Total Questions
                  </span>
                  <span className="font-bold text-base text-foreground sm:text-lg">
                    {questionCount}
                  </span>
                </div>
                <div className="flex items-center justify-between border-border/20 border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Completed
                  </span>
                  <span className="font-bold text-base text-primary sm:text-lg">
                    {currentQuestion}
                  </span>
                </div>
                <div className="flex items-center justify-between border-border/20 border-b pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Remaining
                  </span>
                  <span className="font-bold text-base text-primary sm:text-lg">
                    {Math.max(0, questionCount - currentQuestion)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Status
                  </span>
                  <span className="font-bold text-base text-foreground sm:text-lg">
                    {isConnected ? "Active" : "Not Started"}
                  </span>
                </div>
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
    <VoiceProvider>
      <InterviewContent />
    </VoiceProvider>
  );
}
