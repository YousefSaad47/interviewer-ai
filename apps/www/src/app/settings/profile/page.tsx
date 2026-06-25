import { AuthGuard } from "@/features/auth";
import { ProfileAccountPage } from "@/features/settings";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
