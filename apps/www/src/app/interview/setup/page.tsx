import { AuthGuard } from "@/features/auth/components/auth-guard";
import { SetupInterviewPage } from "@/features/interview/components/setup-interview-page";

export default function SetupInterview() {
  return (
    <AuthGuard>
      <SetupInterviewPage />
    </AuthGuard>
  );
}
