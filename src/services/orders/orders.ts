import { API_BASE_URL } from "@/config";

export const getOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch orders");
  return result;
};
