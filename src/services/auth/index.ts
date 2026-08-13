import { API_BASE_URL } from "@/config";

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setAuthToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }
};

export const getAuthHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
};

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

  if (result.data?.token) {
    setAuthToken(result.data.token);
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

  if (result.data?.token) {
    setAuthToken(result.data.token);
  }

  return result;
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    setAuthToken(null);
    throw new Error(result.message || "Not authenticated");
  }

  return result;
};

export const logoutUser = async () => {
  const tokenHeaders = getAuthHeaders();
  setAuthToken(null);
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: tokenHeaders,
    credentials: "include",
  });

  const result = await res.json();
  return result;
};
