import { API_BASE_URL } from "@/config";

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch users");
  return result;
};
