import { AuthGuard } from "@/features/auth/components/auth-guard";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export default function Page() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
