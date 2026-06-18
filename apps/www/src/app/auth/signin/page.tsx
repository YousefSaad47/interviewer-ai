import { GuestGuard } from "@/lib/auth-guard";
import { SignInPage } from "@/modules/auth/sign-in-page";

export default function Page() {
  return (
    <GuestGuard>
      <SignInPage />
    </GuestGuard>
  );
}
