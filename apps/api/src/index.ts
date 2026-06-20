import "@/common/extensions/zod.ext";
import "@/core/init";

import { toNodeHandler } from "better-auth/node";
import express from "express";

import { ControllersFactory } from "@/common";
import { extendExpressApp } from "@/common/extensions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/middlewares";
import { InterviewService } from "@/modules/interview/interview.service";
import { humeWebhookHandler } from "@/modules/interview/interview.webhook";
import { hume } from "@/services/hume";

const app = express();

extendExpressApp(app);

app.registerCors();
app.use(rateLimitMiddleware);

// Hume webhook — uses raw parser for HMAC verification
const interviewService = new InterviewService(prisma, hume);
app.post(
  "/api/hume/webhook",
  express.raw({ type: "application/json" }),
  humeWebhookHandler(interviewService),
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app
  .registerParsers()
  .registerControllers(ControllersFactory.controllers)
  .registerOpenAPI();

await app.registerBullBoard();

app.registerErrorHandlers();

await app.bootstrap();
