import { GuestGuard, SignInPage } from "@/features/auth";

export default function Page() {
  return (
    <GuestGuard>
      <SignInPage />
    </GuestGuard>
  );
}
