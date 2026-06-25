import { AuthGuard } from "@/features/auth";
import { NotificationsPage } from "@/features/settings";

export default function NotificationsSettingsPage() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
