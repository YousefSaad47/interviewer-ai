import { createAuthClient } from "better-auth/react";

import { env } from "@/config";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
});
