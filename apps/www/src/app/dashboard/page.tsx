import { AuthGuard } from "@/lib/auth-guard";
import { DashboardPage } from "@/modules/dashboard/pages";

export default function Page() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
