import { AdminDashboardPage } from "@/features/admin";
import { AuthGuard } from "@/features/auth";

export default function Page() {
  return (
    <AuthGuard>
      <AdminDashboardPage />
    </AuthGuard>
  );
}
