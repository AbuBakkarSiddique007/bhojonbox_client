"use client";
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center px-4 py-2 bg-secondary hover:bg-muted text-[10px] font-black uppercase tracking-widest rounded-xl border border-border shadow-sm transition-all active:scale-95"
    >
      <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
      Back
    </button>
  );
}
