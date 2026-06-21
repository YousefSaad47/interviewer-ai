import { AuthGuard } from "@/lib/auth-guard";
import { ProfileAccountPage } from "@/modules/settings";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
