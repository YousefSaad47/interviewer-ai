import { AuthGuard } from "@/features/auth";
import { InterviewSettingsPage } from "@/features/settings";

export default function InterviewPage() {
  return (
    <AuthGuard>
      <InterviewSettingsPage />
    </AuthGuard>
  );
}
