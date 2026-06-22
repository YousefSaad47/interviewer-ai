import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ResumeBuilderPage } from "@/features/resume-builder/components/resume-builder-page";

export default function Page() {
  return (
    <AuthGuard>
      <ResumeBuilderPage />
    </AuthGuard>
  );
}
