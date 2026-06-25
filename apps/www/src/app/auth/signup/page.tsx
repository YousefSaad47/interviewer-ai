import { GuestGuard, SignUpPage } from "@/features/auth";

export default function Page() {
  return (
    <GuestGuard>
      <SignUpPage />
    </GuestGuard>
  );
}
