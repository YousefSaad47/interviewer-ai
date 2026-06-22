import { AuthGuard } from "@/features/auth/components/auth-guard";
import { InterviewSettingsPage } from "@/features/settings/components/interview-settings-page";

export default function InterviewPage() {
  return (
    <AuthGuard>
      <InterviewSettingsPage />
    </AuthGuard>
  );
}
