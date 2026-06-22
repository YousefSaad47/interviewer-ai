import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ProblemsPage } from "@/features/problems/components/problems-page";

export default function Page() {
  return (
    <AuthGuard>
      <ProblemsPage />
    </AuthGuard>
  );
}
