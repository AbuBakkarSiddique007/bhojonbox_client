import { API_BASE_URL } from "@/config";

export const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/categories`, { credentials: "include" });
  return res.json();
};

export const createCategory = async (payload: { name: string; image?: string }) => {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCategory = async (id: string, payload: { name?: string; image?: string }) => {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteCategory = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

export default { getCategories, createCategory, updateCategory, deleteCategory };
