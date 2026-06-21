import { google } from "@ai-sdk/google";
import { ollama } from "ai-sdk-ollama";

import { env } from "@/core/env";

export function getAIModel() {
  switch (env.AI_PROVIDER) {
    case "google":
      return google(env.AI_MODEL);
    default:
      return ollama(env.AI_MODEL);
  }
}
