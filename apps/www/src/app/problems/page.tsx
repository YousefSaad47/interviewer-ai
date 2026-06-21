import { AuthGuard } from "@/lib/auth-guard";
import { ProblemsPage } from "@/modules/problem";

export default function Page() {
  return (
    <AuthGuard>
      <ProblemsPage />
    </AuthGuard>
  );
}
