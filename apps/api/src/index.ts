import "@/common/extensions/zod.ext";
import "@/core/init";

import { toNodeHandler } from "better-auth/node";
import express from "express";

import { ControllersFactory } from "@/common";
import { extendExpressApp } from "@/common/extensions";
import { auth } from "@/lib/auth";

const app = express();

extendExpressApp(app);

app.all("/api/auth/*splat", toNodeHandler(auth));

app
  .registerParsers()
  .registerControllers(ControllersFactory.controllers)
  .registerOpenAPI()
  .registerErrorHandlers();

await app.bootstrap();
