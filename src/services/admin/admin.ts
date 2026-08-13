import { API_BASE_URL } from "@/config";
import { getAuthHeaders } from "../auth";

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch users");
  return result;
};
