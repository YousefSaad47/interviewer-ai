import { AuthGuard } from "@/lib/auth-guard";
import { ProblemsPage } from "@/modules/problem/components/problems-page";

export default function Page() {
  return (
    <AuthGuard>
      <ProblemsPage />
    </AuthGuard>
  );
}
