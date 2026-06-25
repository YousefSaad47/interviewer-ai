import { AuthGuard } from "@/features/auth";
import { ProfileAccountPage } from "@/features/settings";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
