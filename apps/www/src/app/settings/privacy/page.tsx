import { AuthGuard } from "@/lib/auth-guard";
import { PrivacySecurityPage } from "@/modules/settings/pages";

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <PrivacySecurityPage />
    </AuthGuard>
  );
}
