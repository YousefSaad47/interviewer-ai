"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { authClient } from "@/services/auth.service";

function GuardFallback() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-md bg-accent" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`guard-fallback-${index}`}
              className="h-28 animate-pulse rounded-xl bg-accent"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-accent" />
      </div>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/dashboard");
    }
  }, [isPending, session, router]);

  if (isPending || session) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
