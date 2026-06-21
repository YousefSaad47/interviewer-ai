import { AuthGuard } from "@/lib/auth-guard";
import { NotificationsPage } from "@/modules/settings";

export default function NotificationsSettingsPage() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
