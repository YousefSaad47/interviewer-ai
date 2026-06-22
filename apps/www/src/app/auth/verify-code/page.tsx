import { Suspense } from "react";

import { GuestGuard } from "@/features/auth/components/auth-guard";
import { VerifyCodePage } from "@/features/auth/components/verify-code-page";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <VerifyCodePage />
      </GuestGuard>
    </Suspense>
  );
}
