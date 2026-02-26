import { API_BASE_URL } from "@/config";

export const getAllMeals = async () => {
  const res = await fetch(`${API_BASE_URL}/meals`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch meals");
  return result;
};

export const getMyMeals = async () => {
  const res = await fetch(`${API_BASE_URL}/meals/provider/my-meals`, {
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch my meals");
  return result;
};
