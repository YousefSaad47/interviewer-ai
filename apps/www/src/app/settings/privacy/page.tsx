import { AuthGuard } from "@/features/auth";
import { PrivacySecurityPage } from "@/features/settings";

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <PrivacySecurityPage />
    </AuthGuard>
  );
}
