import { GuestGuard } from "@/features/auth/components/auth-guard";
import { SignInPage } from "@/features/auth/components/sign-in-page";

export default function Page() {
  return (
    <GuestGuard>
      <SignInPage />
    </GuestGuard>
  );
}
