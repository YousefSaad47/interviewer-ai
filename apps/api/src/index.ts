import { once } from "node:events";

import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

const PORT = Number(process.env.PORT) || 3000;

async function startServer(port: number) {
  const server = app.listen(port);
  await once(server, "listening");
  console.log(`Server is running on port http://localhost:${port}`);
}

try {
  await startServer(PORT);
} catch (error) {
  // biome-ignore lint/suspicious/noExplicitAny: < >
  if ((error as any).code === "EADDRINUSE") {
    startServer(PORT + 1);
  }
}
