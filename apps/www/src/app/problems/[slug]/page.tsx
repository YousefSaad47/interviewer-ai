"use client";

import { useParams } from "next/navigation";

import { AuthGuard } from "@/features/auth";
import { CodingPracticePage } from "@/features/coding-practice";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <AuthGuard>
      <CodingPracticePage slug={slug} />
    </AuthGuard>
  );
}
