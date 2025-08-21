import type { Review } from "@src/models/review.types";
import { create } from "zustand";
import {
  initialReviewsState,
  type ReviewsState,
} from "../reviews/reviews.state";

type ReviewsActions = {
  setLoading: (eventId: string, loading: boolean) => void;
  setError: (eventId: string, error: string | null) => void;
  setReviews: (eventId: string, reviews: Review[]) => void;
  upsertReview: (eventId: string, review: Review) => void;
  removeReview: (eventId: string, reviewId: string) => void;
};

export const reviewsStore = create<ReviewsState & ReviewsActions>(
  (set, get) => ({
    ...initialReviewsState,
    setLoading: (eventId, loading) =>
      set((state) => ({ loading: { ...state.loading, [eventId]: loading } })),
    setError: (eventId, error) =>
      set((state) => ({ error: { ...state.error, [eventId]: error } })),
    setReviews: (eventId, reviews) =>
      set((state) => ({ byEvent: { ...state.byEvent, [eventId]: reviews } })),
    upsertReview: (eventId, review) => {
      const arr = get().byEvent[eventId] ?? [];
      const filtered = arr.filter(
        (review) => review.id !== review.id && review.user.id !== review.user.id
      );
      set((state) => ({
        byEvent: { ...state.byEvent, [eventId]: [review, ...filtered] },
      }));
    },
    removeReview: (eventId, reviewId) => {
      const arr = get().byEvent[eventId] ?? [];
      set((state) => ({
        byEvent: {
          ...state.byEvent,
          [eventId]: arr.filter((review) => review.id !== reviewId),
        },
      }));
    },
  })
);
