import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";

import { env } from "@/core/env";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     console.log(`Verify email for ${user.email}: ${url}`);
  //   },
  // },
  advanced: {
    useSecureCookies: env.isProduction,
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
  // plugins: [twoFactor({ issuer: "Interviewer AI" }), organization()],
});

export type Session = typeof auth.$Infer.Session;
