"use client";

import { useEffect, useRef, useState } from "react";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { adminService } from "@/services";
import { toast } from "sonner";

function RoleBadge({ role }: { role: string }) {
  if (role === "PROVIDER") return <span className="inline-flex text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">PROVIDER</span>;
  if (role === "ADMIN") return <span className="inline-flex text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">ADMIN</span>;
  return <span className="inline-flex text-[10px] font-black px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">CUSTOMER</span>;
}


function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">Active</span>
  ) : (
    <span className="inline-flex text-[10px] font-black px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-widest">Suspended</span>
  );
}

type ProviderProfile = {
  storeName?: string;
  [key: string]: unknown;
};

type User = {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: string;
  isActive?: boolean;
  phone?: string;
  createdAt?: string;
  providerProfile?: ProviderProfile;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<User | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async (opts: { page?: number } = {}) => {
    setLoading(true);
    try {
      const json = await adminService.getUsers({ search, role, page: opts.page ?? page });

      const hasData = (obj: unknown): obj is { data: unknown } => typeof obj === "object" && obj !== null && "data" in obj;
      const hasUsers = (obj: unknown): obj is { users: unknown; pagination?: { pages?: number; page?: number } } => typeof obj === "object" && obj !== null && "users" in obj;

      let data: unknown = json;
      if (hasData(json)) data = (json as { data: unknown }).data;

      if (hasUsers(data) && Array.isArray((data as { users: unknown }).users)) {
        setUsers((data as { users: User[] }).users);
        setPages((data as { pagination?: { pages?: number } }).pagination?.pages || 1);
        setPage((data as { pagination?: { page?: number } }).pagination?.page ? Number((data as { pagination?: { page?: number } }).pagination?.page) : opts.page ?? page);
      } else if (Array.isArray(data)) {
        setUsers(data as User[]);
        setPages(1);
      } else {
        setUsers([]);
        setPages(1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search input so we don't spam the API while typing
  const searchFirstRun = useRef(true);
  useEffect(() => {
    if (searchFirstRun.current) {
      searchFirstRun.current = false;
      return;
    }
    const t = setTimeout(() => {
      fetchUsers({ page: 1 });
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Trigger fetch when role filter changes
  useEffect(() => {
    fetchUsers({ page: 1 });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const [actionLoading, setActionLoading] = useState(false);

  const handleToggle = async (id: string) => {
    setActionLoading(true);
    try {
      await adminService.toggleUserStatus(id);
      toast.success("User status updated");
      await fetchUsers({ page });
      if (selected && selected.id === id) {
        await openDetails(id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    if (!confirm(`Change role to ${newRole}?`)) return;
    setActionLoading(true);
    try {
      await adminService.changeUserRole(id, newRole);
      toast.success("Role updated");
      await fetchUsers({ page });
      if (selected && selected.id === id) {
        await openDetails(id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to change role");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = async (id: string) => {
    setDetailLoading(true);
    try {
      const json = await adminService.getUserById(id);
      const hasData = (obj: unknown): obj is { data: unknown } => typeof obj === "object" && obj !== null && "data" in obj;
      const hasUser = (obj: unknown): obj is { user: unknown } => typeof obj === "object" && obj !== null && "user" in obj;

      let data: unknown = json;
      if (hasData(json)) data = (json as { data: unknown }).data;

      if (hasUser(data)) {
        setSelected((data as { user: User }).user);
      } else if (typeof data === "object" && data !== null) {
        setSelected(data as User);
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-sm text-muted-foreground mb-6">Suspend, activate, and manage all platform users.</p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-3 pl-11 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="w-full sm:w-44">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm font-medium">
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary overflow-hidden border border-primary/5 shadow-inner">
                          {u.avatar ? (
                            <Image src={u.avatar} alt={u.name ?? "avatar"} width={44} height={44} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">{u.name ? u.name.charAt(0).toUpperCase() : "?"}</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm tracking-tight">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground/60">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge active={!!u.isActive} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-6">
                        <button
                          onClick={() => openDetails(u.id)}
                          className="text-[10px] px-4 py-1.5 rounded-xl bg-muted text-muted-foreground hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-black uppercase tracking-widest border border-border/50"
                        >
                          Details
                        </button>
                        <div className="flex flex-col items-center gap-1.5">
                          <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!u.isActive}
                              onChange={() => handleToggle(u.id)}
                              disabled={actionLoading}
                              aria-label={u.isActive ? 'Deactivate user' : 'Activate user'}
                            />
                            <div className={`w-11 h-6 bg-muted-foreground/10 rounded-full peer-checked:bg-emerald-500 transition-all duration-300 ring-4 ring-transparent group-hover:ring-primary/5 ${actionLoading ? 'opacity-50' : ''}`}></div>
                            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 peer-checked:translate-x-5`}></span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">Page {page} of {pages}</div>
        <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => fetchUsers({ page: page - 1 })} className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:bg-muted transition-all">Prev</button>
          <button disabled={page >= pages} onClick={() => fetchUsers({ page: page + 1 })} className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:bg-muted transition-all">Next</button>
        </div>
      </div>



      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-[2rem] max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-border">
                  {selected.avatar ? (
                    <Image src={selected.avatar} alt={selected.name ?? "avatar"} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-muted-foreground">{selected.name ? selected.name.charAt(0) : "?"}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground brand">{selected.name}</h3>
                  <div className="text-xs text-muted-foreground">{selected.email}</div>
                </div>
              </div>
            </div>

            {detailLoading ? (
              <div className="text-center"><Loading /></div>
            ) : (
              <div className="space-y-6">
                {selected.providerProfile ? (
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <div>
                        <div className="text-[10px] text-primary font-black uppercase tracking-widest">Provider</div>
                        <h4 className="text-lg font-black text-foreground brand">{selected.providerProfile.storeName || 'Provider'}</h4>
                      </div>

                    <div className="mt-4 grid gap-3">
                      {(() => {
                        const profile = selected.providerProfile as ProviderProfile;
                        const keys = [
                          'storeName',
                          'phone',
                          'address',
                          'city',
                          'state',
                          'postalCode',
                          'website',
                          'openingHours',
                          'description',
                        ];
                        const labels: Record<string, string> = {
                          storeName: 'Store Name',
                          phone: 'Phone',
                          address: 'Address',
                          city: 'City',
                          state: 'State',
                          postalCode: 'Postal Code',
                          website: 'Website',
                          openingHours: 'Opening Hours',
                          description: 'Description',
                        };

                        return keys
                          .filter((k) => !!profile[k as keyof ProviderProfile])
                          .map((k) => (
                            <div key={k} className="flex items-start justify-between gap-4 bg-card/50 p-3 rounded-xl border border-border">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{labels[k] || k}</div>
                              <div className="text-xs font-semibold text-foreground">{String(profile[k as keyof ProviderProfile])}</div>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center text-muted-foreground italic text-sm">No provider information available.</div>
                )}

                <div className="flex justify-end">
                  <button onClick={() => setSelected(null)} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all" aria-label="Close modal">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
