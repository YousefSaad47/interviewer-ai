import { GuestGuard } from "@/lib/auth-guard";
import { SignUpPage } from "@/modules/auth";

export default function Page() {
  return (
    <GuestGuard>
      <SignUpPage />
    </GuestGuard>
  );
}
