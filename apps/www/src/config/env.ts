import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
  },
  runtimeEnv: {
    // biome-ignore lint/complexity/useLiteralKeys: required by noPropertyAccessFromIndexSignature
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"],
  },
});
