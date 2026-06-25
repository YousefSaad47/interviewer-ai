import { Suspense } from "react";

import { GuestGuard, VerifyCodePage } from "@/features/auth";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <VerifyCodePage />
      </GuestGuard>
    </Suspense>
  );
}
