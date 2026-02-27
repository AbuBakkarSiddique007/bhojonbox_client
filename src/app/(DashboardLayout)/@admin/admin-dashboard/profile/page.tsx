"use client"
import React from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <button
          onClick={() => router.back()}
          className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-sm"
        >
          Back
        </button>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading profile…</p>
          ) : user ? (
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-slate-700">
                {user.name ? user.name.charAt(0) : user.email?.charAt(0) ?? "A"}
              </div>

              <div className="flex-1">
                <div className="text-lg font-medium">{user.name}</div>
                <div className="text-sm text-slate-500">{user.email}</div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Role</div>
                    <div className="font-medium">{user.role}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium">{user.phone ?? "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Joined</div>
                    <div className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">User ID</div>
                    <div className="font-mono text-xs break-all">{user.id}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Not signed in — please sign in to view profile.</div>
          )}
        </div>
      </div>
    </div>
  );
}
