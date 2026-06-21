"use client";

import { useParams } from "next/navigation";

import { AuthGuard } from "@/lib/auth-guard";
import { CodingPracticePage } from "@/modules/coding-practice";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <AuthGuard>
      <CodingPracticePage slug={slug} />
    </AuthGuard>
  );
}
