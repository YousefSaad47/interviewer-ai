import crypto from "node:crypto";

import type { NextFunction, Request, Response } from "express";
import { serialization as HumeSerialization } from "hume";

import {
  BadRequestException,
  UnauthorizedException,
} from "@/common/exceptions";
import { env } from "@/core/env";
import { logger } from "@/lib/logger";

import { InterviewService } from "./interview.service";

const { WebhookEvent } = HumeSerialization.empathicVoice;

function verifyWebhookSignature(
  payload: string,
  headers: Record<string, unknown>,
): void {
  const timestamp = headers["x-hume-ai-webhook-timestamp"] as string;
  if (!timestamp) {
    throw new BadRequestException("Missing webhook timestamp header");
  }

  const signature = headers["x-hume-ai-webhook-signature"] as string;
  if (!signature) {
    throw new BadRequestException("Missing webhook signature header");
  }

  const message = `${payload}.${timestamp}`;
  const expectedSig = crypto
    .createHmac("sha256", env.HUME_WEBHOOK_SIGNING_KEY)
    .update(message)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedSigBuffer = Buffer.from(expectedSig, "utf8");
  const validSignature =
    signatureBuffer.length === expectedSigBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedSigBuffer);

  if (!validSignature) {
    throw new UnauthorizedException("Invalid webhook HMAC signature");
  }

  const timestampInt = Number.parseInt(timestamp, 10);
  if (Number.isNaN(timestampInt)) {
    throw new BadRequestException("Invalid webhook timestamp format");
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - timestampInt > 180) {
    throw new UnauthorizedException("Webhook timestamp is too old");
  }
}

export const humeWebhookHandler =
  (service: InterviewService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadStr = req.body.toString("utf8");

      verifyWebhookSignature(
        payloadStr,
        req.headers as Record<string, unknown>,
      );

      const event = WebhookEvent.parseOrThrow(JSON.parse(payloadStr));

      logger.info(
        { event: event.eventName, chatId: event.chatId },
        "Hume webhook received",
      );

      switch (event.eventName) {
        case "chat_ended":
          await service.finalizeByChatId(event.chatId, {
            chatId: event.chatId,
            chatGroupId: event.chatGroupId,
          });
          break;
        case "chat_started":
          if (event.customSessionId) {
            await service.linkChatToInterview(
              event.customSessionId,
              event.chatId,
              event.chatGroupId,
            );
          }
          break;
        case "tool_call":
          break;
      }

      res.noContent();
    } catch (error) {
      next(error);
    }
  };
