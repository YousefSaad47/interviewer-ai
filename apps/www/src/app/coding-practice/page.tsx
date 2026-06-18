"use client";

import { AuthGuard } from "@/lib/auth-guard";
import { CodingPracticePage } from "@/modules/coding-practice/components";

export default function Page() {
  return (
    <AuthGuard>
      <CodingPracticePage />
    </AuthGuard>
  );
}
