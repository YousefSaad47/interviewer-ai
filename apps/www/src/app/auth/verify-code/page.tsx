import { Suspense } from "react";

import { GuestGuard } from "@/lib/auth-guard";
import { VerifyCodePage } from "@/modules/auth";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <VerifyCodePage />
      </GuestGuard>
    </Suspense>
  );
}
