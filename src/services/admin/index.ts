import { API_BASE_URL } from "../../config";

type FetchOptions = { [key: string]: string | number | boolean | undefined };

const buildQuery = (params: FetchOptions = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    credentials: "include",
  });
  return res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    credentials: "include",
  });
  return res.json();
};

export const getUsers = async (opts: FetchOptions = {}) => {
  const res = await fetch(`${API_BASE_URL}/admin/users${buildQuery(opts)}`, {
    credentials: "include",
  });
  return res.json();
};

export const toggleUserStatus = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/toggle-status`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
};

export const changeUserRole = async (id: string, role: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res.json();
};

export const getOrders = async (opts: FetchOptions = {}) => {
  const res = await fetch(`${API_BASE_URL}/admin/orders${buildQuery(opts)}`, {
    credentials: "include",
  });
  return res.json();
};

const adminService = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  changeUserRole,
  getOrders,
  getUserById,
};

export default adminService;
