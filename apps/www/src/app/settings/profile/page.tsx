import { AuthGuard } from "@/lib/auth-guard";
import { ProfileAccountPage } from "@/modules/settings";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileAccountPage />
    </AuthGuard>
  );
}
