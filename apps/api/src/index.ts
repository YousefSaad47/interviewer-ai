import "@/common/extensions/zod.ext";
import "@/core/init";

import { toNodeHandler } from "better-auth/node";
import express from "express";

import { ControllersFactory, ServicesFactory } from "@/common";
import { Services } from "@/common/enums";
import { extendExpressApp } from "@/common/extensions";
import { auth } from "@/lib/auth";
import { rateLimitMiddleware } from "@/middlewares";
import { humeWebhookHandler, InterviewService } from "@/modules/interview";

const app = express();

extendExpressApp(app);

app.registerCors();
app.use(rateLimitMiddleware);

const interviewService = ServicesFactory.create<InterviewService>(
  Services.INTERVIEW,
);

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
