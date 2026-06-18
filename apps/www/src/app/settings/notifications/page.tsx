import { AuthGuard } from "@/lib/auth-guard";
import { NotificationsPage } from "@/modules/settings/pages";

export default function NotificationsSettingsPage() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
