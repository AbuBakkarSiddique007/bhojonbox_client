import { API_BASE_URL } from "@/config";

export const loginUser = async (data: { email: string; password: string }) => {
  
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER";
  phone?: string;
  address?: string;
  storeName?: string;
  cuisine?: string;
  description?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};
