import { AuthGuard } from "@/lib/auth-guard";
import { InterviewSettingsPage } from "@/modules/settings/pages";

export default function InterviewPage() {
  return (
    <AuthGuard>
      <InterviewSettingsPage />
    </AuthGuard>
  );
}
