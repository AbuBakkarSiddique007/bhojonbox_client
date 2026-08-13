"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { authService } from "@/services";
import ImageUpload from "@/components/ui/ImageUpload";


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
      const res = await fetch(`${API_BASE_URL}/providers/me/profile`, { headers: authService.getAuthHeaders(), credentials: "include" });
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
      // Failed silently is okay here as we fallback to current user state
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

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
        headers: authService.getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");

      toast.success("Profile updated");

      try {
        const me = await authService.getMe();
        if (me?.data?.user) setUser(me.data.user);
      } catch {
        // failed to refresh user, but profile is saved
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
      <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="space-y-4 w-full md:w-1/2">
               <div className="h-10 bg-muted/50 rounded-2xl w-3/4 animate-pulse" />
               <div className="h-4 bg-muted/50 rounded-full w-1/2 animate-pulse" />
            </div>
            <div className="h-14 bg-muted/50 rounded-2xl w-40 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-[2.5rem] p-10 h-[500px] animate-pulse flex flex-col items-center gap-8">
                 <div className="w-32 h-32 rounded-3xl bg-muted/50" />
                 <div className="h-6 bg-muted/50 rounded-full w-2/3" />
                 <div className="h-4 bg-muted/50 rounded-full w-1/2" />
                 <div className="w-full space-y-4 mt-8">
                    <div className="h-12 bg-muted/50 rounded-2xl" />
                    <div className="h-12 bg-muted/50 rounded-2xl" />
                 </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-[2.5rem] p-10 h-full animate-pulse space-y-10">
                 <div className="h-8 bg-muted/50 rounded-full w-1/3" />
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4"><div className="h-4 bg-muted/50 rounded-full w-1/4" /><div className="h-14 bg-muted/50 rounded-2xl" /></div>
                    <div className="space-y-4"><div className="h-4 bg-muted/50 rounded-full w-1/4" /><div className="h-14 bg-muted/50 rounded-2xl" /></div>
                    <div className="space-y-4"><div className="h-4 bg-muted/50 rounded-full w-1/4" /><div className="h-14 bg-muted/50 rounded-2xl" /></div>
                    <div className="space-y-4"><div className="h-4 bg-muted/50 rounded-full w-1/4" /><div className="h-14 bg-muted/50 rounded-2xl" /></div>
                 </div>
                 <div className="space-y-4"><div className="h-4 bg-muted/50 rounded-full w-1/4" /><div className="h-32 bg-muted/50 rounded-2xl" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase">Executive Profile</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Manage your gourmet store brand and operational details.</p>
        </div>

        <div className="flex items-center gap-3">
            <button 
              onClick={() => setEditing((v) => !v)}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${editing ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-muted'}`}
            >
              {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            {editing && (
              <button 
                disabled={loading} 
                onClick={saveProfile} 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
              >
                {loading ? <Loading inline size="sm" /> : 'Save Changes'}
              </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-[2.5rem] p-10 sticky top-8 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative group/logo w-full flex justify-center pb-8 border-b border-border/50 mb-8">
                <div className="w-40 h-40 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-6xl font-black text-primary border-4 border-card shadow-2xl group-hover/logo:scale-105 transition-transform duration-500 overflow-hidden relative">
                  {editing ? (
                    <ImageUpload 
                      className="w-full h-full absolute inset-0" 
                      label="" 
                      value={logo} 
                      onChange={setLogo} 
                    />
                  ) : (
                    logo ? <img src={logo} alt="Store logo" className="w-full h-full object-cover" /> : (storeName ? storeName.charAt(0) : (user?.name ? user.name.charAt(0) : 'P'))
                  )}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-foreground brand mb-3 leading-tight">{storeName || 'Your Gourmet Store'}</h2>
              <div className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-8">Official Provider</div>
              
              <p className="text-muted-foreground text-sm italic leading-relaxed mb-10 px-4 opacity-80">
                {description || "No store description provided yet. Add one to attract more customers!"}
              </p>

              <div className="w-full pt-8 border-t border-border/50 flex flex-col gap-5">
                 <div className="flex items-center justify-between text-[10px] px-2 font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Store Status</span>
                    <span className={`flex items-center gap-2 ${isOpen ? 'text-emerald-500' : 'text-destructive'}`}>
                      <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`}></span>
                      {isOpen ? 'Open Now' : 'Closed'}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] px-2 font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Certified Since</span>
                    <span className="text-foreground">April 2026</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-[2.5rem] p-10 lg:p-12 shadow-sm relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            
            <h3 className="text-2xl font-black text-foreground brand mb-12 flex items-center gap-4">
               <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base shadow-inner">📋</span>
               Boutique Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Store Identity</label>
                  <input value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={!editing} className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-foreground placeholder:text-muted-foreground/30 shadow-sm" placeholder="The Emerald Kitchen" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Cuisine Genre</label>
                  <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} disabled={!editing} className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-foreground placeholder:text-muted-foreground/30 shadow-sm" placeholder="Traditional Bengali, Italian Fusion" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Inquiry Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-foreground shadow-sm" />
                </div>
              </div>

              <div className="space-y-8">
                 <div className="hidden">
                  {/* Removed manual text input for Logo Reference; now handled by ImageUpload */}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Establishment Location</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-foreground resize-none shadow-sm" rows={4} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Brand Narrative</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editing} className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-foreground resize-none shadow-sm leading-relaxed" rows={6} />
              </div>

              <div className="md:col-span-2 flex items-center gap-5 p-8 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner group">
                <input id="isOpen" type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} disabled={!editing} className="w-8 h-8 rounded-xl text-primary focus:ring-primary/30 cursor-pointer disabled:cursor-not-allowed transition-all checked:scale-110" />
                <div className="flex flex-col">
                  <label htmlFor="isOpen" className="text-base font-black text-foreground cursor-pointer uppercase tracking-tighter">Live Operations</label>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-normal">When suspended, your culinary offerings will be concealed from the marketplace.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
