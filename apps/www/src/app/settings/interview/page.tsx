import { AuthGuard } from "@/lib/auth-guard";
import { InterviewSettingsPage } from "@/modules/settings";

export default function InterviewPage() {
  return (
    <AuthGuard>
      <InterviewSettingsPage />
    </AuthGuard>
  );
}
