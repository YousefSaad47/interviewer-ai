import { GuestGuard } from "@/lib/auth-guard";
import { SignInPage } from "@/modules/auth";

export default function Page() {
  return (
    <GuestGuard>
      <SignInPage />
    </GuestGuard>
  );
}
