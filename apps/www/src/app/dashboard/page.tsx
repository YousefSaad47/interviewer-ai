import { AuthGuard } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";

export default function Page() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
