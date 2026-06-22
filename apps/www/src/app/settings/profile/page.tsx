import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ProfileAccountPage } from "@/features/settings/components/profile-account-page";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
