import { AuthGuard } from "@/lib/auth-guard";
import { ProfileAccountPage } from "@/modules/settings/pages";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
