import { GuestGuard } from "@/lib/auth-guard";
import { ForgotPasswordPage } from "@/modules/auth";

export default function Page() {
  return (
    <GuestGuard>
      <ForgotPasswordPage />
    </GuestGuard>
  );
}
