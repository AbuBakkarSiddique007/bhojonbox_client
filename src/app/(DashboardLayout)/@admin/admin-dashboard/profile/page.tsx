"use client"
import React from "react";
import { useAuth } from "@/hooks/AuthContext";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
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
          <div className="bg-card border border-border rounded-[2.5rem] p-10 h-[400px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase text-primary">Administrative Core</h1>
          <p className="text-muted-foreground mt-2 font-medium italic opacity-80">Platform governance and executive identity management.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground border border-border font-black text-xs uppercase tracking-widest hover:bg-muted transition-all active:scale-95 shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-1000"></div>
          
          {user ? (
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <div className="relative group/avatar">
                <div className="w-40 h-40 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-6xl font-black text-primary border-8 border-card shadow-2xl group-hover/avatar:scale-105 transition-transform duration-500 overflow-hidden">
                  {user.name ? user.name.charAt(0) : (user.email?.charAt(0) ?? "A")}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-4 border-card">
                   <span className="text-xs">🛡️</span>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-foreground brand mb-2">{user.name}</h2>
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 bg-primary/10 inline-block px-4 py-1.5 rounded-full">Executive Administrator</p>
                    <div className="text-sm text-muted-foreground italic opacity-70 tracking-tight">{user.email}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                  <div className="p-6 bg-muted/20 rounded-3xl border border-border shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                       Clearance Role
                    </div>
                    <div className="font-black text-foreground brand uppercase tracking-tighter text-lg">{user.role}</div>
                  </div>

                  <div className="p-6 bg-muted/20 rounded-3xl border border-border shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                       Secure Contact
                    </div>
                    <div className="font-black text-foreground brand uppercase tracking-tighter text-lg">{user.phone ?? "N/A"}</div>
                  </div>

                  <div className="p-6 bg-muted/20 rounded-3xl border border-border shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                       Establishment Date
                    </div>
                    <div className="font-black text-foreground brand uppercase tracking-tighter text-lg">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                  </div>

                  <div className="p-6 bg-muted/20 rounded-3xl border border-border shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                       Governance ID
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground break-all opacity-60 uppercase">{user.id}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
               <div className="text-5xl mb-6">🔒</div>
               <p className="text-muted-foreground italic font-medium">Clearance required. Please sign in to view administrative session details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
