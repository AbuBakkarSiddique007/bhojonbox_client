"use client";

import { Suspense } from "react";
import LoginForm from "@/components/modules/auth/login/LoginForm";
import Loading from "@/components/ui/Loading";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Suspense fallback={<div className="mb-6"><Loading /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}