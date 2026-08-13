import { API_BASE_URL } from "@/config";
import { getAuthHeaders } from "../auth";

export const createReview = async (payload: { mealId: string; orderId: string; rating: number; comment?: string }) => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getMyReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/reviews/user/my-reviews`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
};

export const getReviewsByMeal = async (mealId: string) => {
  const res = await fetch(`${API_BASE_URL}/reviews/meal/${mealId}`);
  return res.json();
};

const reviewsService = { createReview, getMyReviews, getReviewsByMeal };

export default reviewsService;
