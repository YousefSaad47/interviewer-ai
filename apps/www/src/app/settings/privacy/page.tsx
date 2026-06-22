import { AuthGuard } from "@/features/auth/components/auth-guard";
import { PrivacySecurityPage } from "@/features/settings/components/privacy-security-page";

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <PrivacySecurityPage />
    </AuthGuard>
  );
}
