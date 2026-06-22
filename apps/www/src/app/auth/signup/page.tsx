import { GuestGuard } from "@/features/auth/components/auth-guard";
import { SignUpPage } from "@/features/auth/components/sign-up-page";

export default function Page() {
  return (
    <GuestGuard>
      <SignUpPage />
    </GuestGuard>
  );
}
