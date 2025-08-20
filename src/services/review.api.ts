import type { Review } from "@src/models/review.types";
import { api } from "@src/services/api";

export async function getReviews(eventId: string): Promise<Review[]> {
  const res = await api.get(`/reviews/event/${eventId}`);
  return res.data;
}

export async function addReview(
  eventId: string,
  rating: number,
  comment?: string
): Promise<Review> {
  const res = await api.post(`/reviews/${eventId}`, { rating, comment });
  return res.data;
}

export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
