"use client";

import { useParams } from "next/navigation";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CodingPracticePage } from "@/features/coding-practice/components/coding-practice-page";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <AuthGuard>
      <CodingPracticePage slug={slug} />
    </AuthGuard>
  );
}
