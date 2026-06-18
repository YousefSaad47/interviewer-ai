import { GuestGuard } from "@/lib/auth-guard";
import { SignUpPage } from "@/modules/auth/sign-up-page";

export default function Page() {
  return (
    <GuestGuard>
      <SignUpPage />
    </GuestGuard>
  );
}
