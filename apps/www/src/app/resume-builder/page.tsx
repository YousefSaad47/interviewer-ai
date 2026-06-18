import { AuthGuard } from "@/lib/auth-guard";
import { ResumeBuilderPage } from "@/modules/resume-builder";

export default function Page() {
  return (
    <AuthGuard>
      <ResumeBuilderPage />
    </AuthGuard>
  );
}
