import { AuthGuard } from "@/features/auth/components/auth-guard";
import { TechnicalInterviewPage } from "@/features/interview/components/technical-interview-page";

export default function TechnicalInterview() {
  return (
    <AuthGuard>
      <TechnicalInterviewPage />
    </AuthGuard>
  );
}
