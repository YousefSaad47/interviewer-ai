import { AuthGuard } from "@/lib/auth-guard";
import { TechnicalInterviewPage } from "@/modules/interview/pages";

export default function TechnicalInterview() {
  return (
    <AuthGuard>
      <TechnicalInterviewPage />
    </AuthGuard>
  );
}
