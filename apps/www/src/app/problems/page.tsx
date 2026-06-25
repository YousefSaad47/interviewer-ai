import { AuthGuard } from "@/features/auth";
import { ProblemsPage } from "@/features/problems";

export default function Page() {
  return (
    <AuthGuard>
      <ProblemsPage />
    </AuthGuard>
  );
}
