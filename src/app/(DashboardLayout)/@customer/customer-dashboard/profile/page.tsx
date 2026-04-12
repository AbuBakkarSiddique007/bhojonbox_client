"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CustomerProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!name) return toast.error("Name is required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, avatar }),
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
    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase">Personal Narrative</h1>
          <p className="text-muted-foreground mt-2 font-medium italic opacity-80">Manage your gourmet preferences and executive identity.</p>
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
                {loading ? <Loading inline size="sm" /> : 'Confirm Changes'}
              </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group h-fit sticky top-8">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex flex-col items-center text-center relative z-10 w-full">
              <div className="w-40 h-40 mb-8 border-4 border-card shadow-2xl rounded-full relative z-20 group-hover:scale-105 transition-transform duration-500 overflow-hidden bg-primary/5">
                {editing ? (
                  <ImageUpload 
                    className="w-full h-full absolute inset-0" 
                    isAvatar
                    label="" 
                    value={avatar} 
                    onChange={setAvatar} 
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-6xl font-black text-primary overflow-hidden">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : (user?.name ? user.name.charAt(0) : 'U')}
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-black text-foreground brand mb-2">{user?.name || 'Gourmet Enthusiast'}</h2>
              <div className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-8">Premium Customer</div>
              <div className="text-sm text-muted-foreground italic opacity-70 mb-8 border-t border-border/50 pt-6 w-full">{user?.email}</div>
              
              <div className="w-full flex flex-col gap-4">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-2">
                    <span className="text-muted-foreground">Account Tier</span>
                    <span className="text-primary">Executive Scholar</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Active</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-card border border-border rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
              
              <h3 className="text-2xl font-black text-foreground brand mb-10 flex items-center gap-4">
                 <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base shadow-inner">👤</span>
                 Profile Details
              </h3>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Legal Identity</label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      disabled={!editing} 
                      className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 font-semibold text-foreground shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Primary Connection</label>
                    <input 
                      value={email} 
                      disabled 
                      className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/10 border border-border/50 text-muted-foreground font-semibold cursor-not-allowed opacity-60" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Secure Contact</label>
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      disabled={!editing} 
                      className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 font-semibold text-foreground shadow-sm" 
                      placeholder="+880 1XX-XXX-XXXX" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Member ID</label>
                    <div className="px-6 py-5 rounded-[1.25rem] bg-muted/10 border border-border/50 text-[10px] font-mono font-bold text-muted-foreground opacity-60 break-all uppercase flex items-center overflow-hidden h-[60px]">
                      {user?.id}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">Establishment / Delivery Coordinates</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    disabled={!editing} 
                    className="w-full px-6 py-5 rounded-[1.25rem] bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-75 font-semibold text-foreground shadow-sm resize-none leading-relaxed" 
                    rows={4} 
                  />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
