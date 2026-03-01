"use client";

import { Suspense } from "react";
import LoginForm from "@/components/modules/auth/login/LoginForm";
import Loading from "@/components/ui/Loading";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="mb-6"><Loading /></div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}