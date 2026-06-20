import { fetchAccessToken, HumeClient } from "hume";

import { env } from "@/core/env";
import { logger } from "@/lib/logger";

const INTERVIEW_SYSTEM_PROMPT = `You are a professional technical interviewer. You have exactly 5 questions to ask.

QUESTION TRACKING RULES:
- Before each new distinct question, say "QUESTION_START" then ask the question.
- Do NOT say "QUESTION_START" for follow-ups, clarifications, or feedback.
- Question 1 is the first question you ask, question 2 is the second, etc.

CONVERSATION FLOW:
1. Say "QUESTION_START", then ask question 1
2. Listen to the answer, give brief feedback
3. If needed, ask a follow-up (DO NOT say QUESTION_START)
4. When ready for the next question, say "QUESTION_START", then ask question 2
5. Repeat until all 5 questions are done
6. After question 5, wrap up the interview

Be encouraging but thorough. Keep the interview moving at a good pace.`;

export class HumeService {
  private readonly client: HumeClient;
  private cachedToken: { token: string; expiresAt: number } | null = null;
  private cachedConfigId: string | null = null;
  constructor(apiKey: string) {
    this.client = new HumeClient({ apiKey });
  }

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.token;
    }

    logger.info("Fetching new Hume access token");

    const token = await fetchAccessToken({
      apiKey: env.HUME_API_KEY,
      secretKey: env.HUME_SECRET_KEY,
    });

    this.cachedToken = {
      token,
      expiresAt: Date.now() + 25 * 60 * 1000,
    };

    return token;
  }

  async fetchChatEvents(chatId: string) {
    logger.info({ chatId }, "Fetching Hume chat events");

    return this.client.empathicVoice.chats.listChatEvents(chatId, {
      pageNumber: 0,
      pageSize: 100,
      ascendingOrder: true,
    });
  }

  async getOrCreateConfig(): Promise<string> {
    if (this.cachedConfigId) {
      return this.cachedConfigId;
    }

    logger.info("Fetching or creating Hume interview config");

    const configs = await this.client.empathicVoice.configs.listConfigs({
      pageNumber: 0,
      pageSize: 50,
    });

    const existing = configs.response?.configsPage?.find(
      (c) => c.name === "Interviewer AI",
    );

    if (existing?.id) {
      this.cachedConfigId = existing.id;
      return existing.id;
    }

    const configData: Parameters<
      typeof this.client.empathicVoice.configs.createConfig
    >[0] = {
      name: "Interviewer AI",
      eviVersion: "3",
      voice: {
        provider: "HUME_AI",
        name: "Ava Song",
      },
      prompt: {
        text: INTERVIEW_SYSTEM_PROMPT,
      },
    };

    if (env.HUME_WEBHOOK_URL) {
      configData.webhooks = [
        {
          url: `${env.HUME_WEBHOOK_URL}/api/hume/webhook`,
          events: ["chat_started", "chat_ended", "tool_call"] as Array<
            "chat_started" | "chat_ended" | "tool_call"
          >,
        },
      ];
    }

    const config =
      await this.client.empathicVoice.configs.createConfig(configData);

    if (!config.id) {
      throw new Error("Failed to create Hume config: no id returned");
    }

    this.cachedConfigId = config.id;
    return config.id;
  }
}

export const hume = new HumeService(env.HUME_API_KEY);
