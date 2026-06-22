import { AuthGuard } from "@/features/auth/components/auth-guard";
import { NotificationsPage } from "@/features/settings/components/notifications-page";

export default function NotificationsSettingsPage() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
