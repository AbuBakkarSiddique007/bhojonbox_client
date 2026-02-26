"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

export default function DashboardRootRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role === "ADMIN") router.replace("/admin-dashboard");
      else if (user.role === "PROVIDER") router.replace("/provider-dashboard");
      else router.replace("/customer-dashboard/orders");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting to your workspace…</p>
    </div>
  );
}
