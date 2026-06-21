import { AuthGuard } from "@/lib/auth-guard";
import { SetupInterviewPage } from "@/modules/interview";

export default function SetupInterview() {
  return (
    <AuthGuard>
      <SetupInterviewPage />
    </AuthGuard>
  );
}
