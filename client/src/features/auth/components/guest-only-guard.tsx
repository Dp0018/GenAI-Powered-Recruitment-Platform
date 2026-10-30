"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";

interface GuestOnlyGuardProps {
  children: React.ReactNode;
}

export function GuestOnlyGuard({ children }: GuestOnlyGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "EMPLOYER_ADMIN" || user.role === "RECRUITER") {
        router.replace("/dashboard/employer");
      } else if (user.role === "PLATFORM_ADMIN") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/candidate");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Verifying session...
        </span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Redirecting to workspace...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
