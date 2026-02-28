"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!name) return toast.error("Name is required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");
      const updated = json?.data?.user;
      if (updated) setUser(updated);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center text-2xl font-semibold text-amber-700">{user?.name ? user.name.charAt(0) : 'U'}</div>
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-slate-500">{user?.email}</div>
            <div className="mt-2">
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{user?.role}</span>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} disabled className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" placeholder="+880 1XX-XXX-XXXX" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Delivery Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" rows={3} />
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-3">
              <Button onClick={() => setEditing((v) => !v)}>{editing ? 'Cancel' : 'Edit Profile'}</Button>
              <Button disabled={!editing || loading} onClick={saveProfile} className="bg-amber-600 text-white">
                {loading ? <Loading inline size="sm" label="Saving…" /> : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

