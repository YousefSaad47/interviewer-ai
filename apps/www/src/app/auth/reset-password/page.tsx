import { Suspense } from "react";

import { GuestGuard } from "@/lib/auth-guard";
import { ResetPasswordPage } from "@/modules/auth/reset-password-page";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <ResetPasswordPage />
      </GuestGuard>
    </Suspense>
  );
}
