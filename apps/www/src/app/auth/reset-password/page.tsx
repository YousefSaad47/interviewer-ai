import { Suspense } from "react";

import { GuestGuard, ResetPasswordPage } from "@/features/auth";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <ResetPasswordPage />
      </GuestGuard>
    </Suspense>
  );
}
