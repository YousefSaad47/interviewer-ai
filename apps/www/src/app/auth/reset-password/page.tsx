import { Suspense } from "react";

import { GuestGuard } from "@/lib/auth-guard";
import { ResetPasswordPage } from "@/modules/auth";

export default function Page() {
  return (
    <Suspense>
      <GuestGuard>
        <ResetPasswordPage />
      </GuestGuard>
    </Suspense>
  );
}
