"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { getMe } from "@/services/auth";

type ProviderProfile = {
  storeName?: string;
  cuisine?: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  isOpen?: boolean;
};

type AuthUser = {
  name?: string;
  email?: string;
  providerProfile?: ProviderProfile;
};

export default function ProviderProfilePage() {
  const { user, setUser } = useAuth();
  const authUser = user as AuthUser | undefined;

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const [storeName, setStoreName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const fetchProfile = async () => {
    try {
      setInitialLoading(true);
      const res = await fetch(`${API_BASE_URL}/providers/me/profile`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch profile");

      const p = json?.data?.profile;
      if (p) {
        setStoreName(p.storeName ?? "");
        setCuisine(p.cuisine ?? "");
        setDescription(p.description ?? "");
        setLogo(p.logo ?? "");
        setAddress(p.address ?? "");
        setPhone(p.phone ?? "");
        setIsOpen(typeof p.isOpen === 'boolean' ? p.isOpen : true);
      }
    } catch {
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // prefill from auth user if providerProfile exists
  useEffect(() => {
    const p = authUser?.providerProfile;
    if (!p) return;
    if (!storeName) setStoreName(p.storeName ?? "");
    if (!cuisine) setCuisine(p.cuisine ?? "");
    if (!description) setDescription(p.description ?? "");
    if (!logo) setLogo(p.logo ?? "");
    if (!address) setAddress(p.address ?? "");
    if (!phone) setPhone(p.phone ?? "");
    if (typeof p.isOpen === 'boolean') setIsOpen(p.isOpen);
  }, [authUser, storeName, cuisine, description, logo, address, phone]);

  const saveProfile = async () => {
    if (!storeName.trim()) return toast.error("Store name is required");

    try {
      setLoading(true);

      const payload = {
        storeName: storeName.trim(),
        cuisine: cuisine.trim(),
        description: description.trim(),
        logo: logo.trim(),
        address: address.trim(),
        phone: phone.trim(),
        isOpen,
      };

      const res = await fetch(`${API_BASE_URL}/providers/me/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");

      toast.success("Profile updated");

      // refresh auth state (so providerProfile on user is up-to-date)
      try {
        const me = await getMe();
        if (me?.data?.user) setUser(me.data.user);
      } catch {
      }

      setEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl bg-amber-50 border border-amber-100 rounded-lg p-6">
          <div className="flex items-center justify-center flex-col gap-4 py-8">
            <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
            <div className="text-sm text-amber-700">Loading profile…</div>
          </div>

          <div className="space-y-3 mt-4 animate-pulse">
            <div className="h-12 bg-amber-100 rounded" />
            <div className="h-12 bg-amber-100 rounded" />
            <div className="h-28 bg-amber-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Provider Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your store details</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center text-2xl font-semibold text-amber-700">{storeName ? storeName.charAt(0) : (user?.name ? user.name.charAt(0) : 'P')}</div>
          <div>
            <div className="font-medium">{storeName || authUser?.providerProfile?.storeName || 'Your Store'}</div>
            <div className="text-sm text-slate-500">{user?.email}</div>
            <div className="mt-2">
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">PROVIDER</span>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cuisine</label>
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input value={logo} onChange={(e) => setLogo(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} className="w-full px-4 py-3 rounded-md bg-amber-50 border border-amber-100" rows={2} />
          </div>

          <div className="flex items-center gap-3">
            <input id="isOpen" type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} disabled={!editing} />
            <label htmlFor="isOpen" className="text-sm">Open for orders</label>
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-3">
              <Button onClick={() => setEditing((v) => !v)}>{editing ? 'Cancel' : 'Edit Profile'}</Button>
              <Button disabled={!editing || loading} onClick={saveProfile} className="bg-amber-600 text-white">
                {loading ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
