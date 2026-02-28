"use client";

import { Suspense } from "react";
import RegisterForm from "@/components/modules/auth/register/registerForm";
import Loading from "@/components/ui/Loading";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="mb-6"><Loading /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}