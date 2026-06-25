import { AuthGuard } from "@/features/auth";
import { ResumeBuilderPage } from "@/features/resume-builder";

export default function Page() {
  return (
    <AuthGuard>
      <ResumeBuilderPage />
    </AuthGuard>
  );
}
