import { ForgotPasswordPage, GuestGuard } from "@/features/auth";

export default function Page() {
  return (
    <GuestGuard>
      <ForgotPasswordPage />
    </GuestGuard>
  );
}
