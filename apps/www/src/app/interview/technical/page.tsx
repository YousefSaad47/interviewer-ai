import { AuthGuard } from "@/features/auth";
import { TechnicalInterviewPage } from "@/features/interview";

export default function TechnicalInterview() {
  return (
    <AuthGuard>
      <TechnicalInterviewPage />
    </AuthGuard>
  );
}
