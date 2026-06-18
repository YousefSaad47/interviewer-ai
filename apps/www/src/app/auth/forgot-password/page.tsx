import { GuestGuard } from "@/lib/auth-guard";
import { ForgotPasswordPage } from "@/modules/auth/forgot-password-page";

export default function Page() {
  return (
    <GuestGuard>
      <ForgotPasswordPage />
    </GuestGuard>
  );
}
