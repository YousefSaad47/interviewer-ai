import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ProfileAccountPage } from "@/features/settings/components/profile-account-page";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
