import { AuthGuard } from "@/lib/auth-guard";
import { SetupInterviewPage } from "@/modules/interview/pages";

export default function SetupInterview() {
  return (
    <AuthGuard>
      <SetupInterviewPage />
    </AuthGuard>
  );
}
