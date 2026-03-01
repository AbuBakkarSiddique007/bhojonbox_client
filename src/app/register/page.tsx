"use client";

import { Suspense } from "react";
import RegisterForm from "@/components/modules/auth/register/registerForm";
import Loading from "@/components/ui/Loading";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="mb-6"><Loading /></div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}