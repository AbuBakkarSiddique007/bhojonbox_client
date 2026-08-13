import { API_BASE_URL } from "@/config";
import { getAuthHeaders } from "../auth";

export const getOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch orders");
  return result;
};

export const getMyOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch my orders");
  return result;
};

export const cancelOrder = async (orderId: string) => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to cancel order");
  return result;
};
