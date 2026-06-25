import { AuthGuard } from "@/features/auth";
import { SetupInterviewPage } from "@/features/interview";

export default function SetupInterview() {
  return (
    <AuthGuard>
      <SetupInterviewPage />
    </AuthGuard>
  );
}
