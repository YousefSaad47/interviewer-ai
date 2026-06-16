import "@/common/extensions/zod.ext";
import "@/core/init";

import express from "express";

import { ControllersFactory } from "@/common";
import { extendExpressApp } from "@/common/extensions";

const app = express();

extendExpressApp(app);

app
  .registerParsers()
  .registerControllers(ControllersFactory.controllers)
  .registerOpenAPI()
  .registerErrorHandlers();

await app.bootstrap();
