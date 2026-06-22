import { GuestGuard } from "@/features/auth/components/auth-guard";
import { ForgotPasswordPage } from "@/features/auth/components/forgot-password-page";

export default function Page() {
  return (
    <GuestGuard>
      <ForgotPasswordPage />
    </GuestGuard>
  );
}
