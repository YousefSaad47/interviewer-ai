import { AuthGuard } from "@/features/auth";
import { InterviewResultsPage } from "@/features/interview";

export default function InterviewResults() {
  return (
    <AuthGuard>
      <InterviewResultsPage />
    </AuthGuard>
  );
}
