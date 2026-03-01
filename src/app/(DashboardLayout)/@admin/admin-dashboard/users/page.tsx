"use client";

import { useEffect, useRef, useState } from "react";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { adminService } from "@/services";
import { toast } from "sonner";

function RoleBadge({ role }: { role: string }) {
  if (role === "PROVIDER") return <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">PROVIDER</span>;
  if (role === "ADMIN") return <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">ADMIN</span>;
  return <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">CUSTOMER</span>;
}


function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
  ) : (
    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-rose-100 text-rose-700">Suspended</span>
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

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full p-3 pl-10 rounded-lg bg-white border shadow-sm"
          />
        </div>

        <div className="w-40">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 rounded-lg bg-white border">
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-3">
        <div className="grid grid-cols-6 gap-4 py-2 px-3 text-xs text-slate-500 uppercase font-semibold">
          <div className="col-span-2">User</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-center"><Loading /></div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="grid grid-cols-6 items-center gap-4 py-4 px-3">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-amber-600 overflow-hidden">
                    {u.avatar ? (
                      <Image src={u.avatar} alt={u.name ?? "avatar"} width={40} height={40} className="object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">{u.name ? u.name.charAt(0) : "?"}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{u.name}</div>
                    <div className="text-sm text-slate-500">{u.email}</div>
                    <div className="mt-2">
                      <button onClick={() => openDetails(u.id)} className="text-sm px-3 py-1 rounded bg-white">Details</button>
                    </div>
                  </div>
                </div>

                <div>
                  <RoleBadge role={u.role} />
                </div>

                <div className="text-slate-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</div>

                <div>
                  <StatusBadge active={!!u.isActive} />
                </div>

                <div className="flex items-center justify-end justify-self-end">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!u.isActive}
                      onChange={() => handleToggle(u.id)}
                      disabled={actionLoading}
                      aria-label={u.isActive ? 'Deactivate user' : 'Activate user'}
                    />
                    <div className={`w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-colors ${actionLoading ? 'opacity-50' : ''}`}></div>
                    <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5`}></span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">Page {page} of {pages}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => fetchUsers({ page: page - 1 })} className="px-3 py-1 rounded bg-white border">Prev</button>
          <button disabled={page >= pages} onClick={() => fetchUsers({ page: page + 1 })} className="px-3 py-1 rounded bg-white border">Next</button>
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {selected.avatar ? (
                    <Image src={selected.avatar} alt={selected.name ?? "avatar"} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-slate-500">{selected.name ? selected.name.charAt(0) : "?"}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <div className="text-sm text-muted-foreground">{selected.email}</div>
                </div>
              </div>
            </div>

            {detailLoading ? (
              <div className="text-center"><Loading /></div>
            ) : (
              <div className="space-y-6">
                {selected.providerProfile ? (
                  <div className="p-6 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-amber-700 font-semibold">Provider</div>
                        <h4 className="text-xl font-bold text-amber-900">{selected.providerProfile.storeName || 'Provider'}</h4>
                      </div>
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
                            <div key={k} className="flex items-start justify-between gap-4 bg-white/60 p-3 rounded">
                              <div className="text-xs text-slate-500 uppercase">{labels[k] || k}</div>
                              <div className="text-sm font-medium text-slate-800">{String(profile[k as keyof ProviderProfile])}</div>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-slate-50 text-center text-slate-600">No provider information available.</div>
                )}

                <div className="flex justify-end">
                  <button onClick={() => setSelected(null)} className="btn btn-primary" aria-label="Close modal btn-error">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
