"use client";
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-sm rounded-md"
    >
      ← Back
    </button>
  );
}
