import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Review } from "@src/models/review.types";
import { initialReviewsState } from "../../reviews/reviews.state";

const slice = createSlice({
  name: "reviews",
  initialState: initialReviewsState,
  reducers: {
    setLoading(
      state,
      action: PayloadAction<{ eventId: string; loading: boolean }>
    ) {
      state.loading[action.payload.eventId] = action.payload.loading;
    },
    setError(
      state,
      action: PayloadAction<{ eventId: string; error: string | null }>
    ) {
      state.error[action.payload.eventId] = action.payload.error;
    },
    setReviews(
      state,
      action: PayloadAction<{ eventId: string; reviews: Review[] }>
    ) {
      state.byEvent[action.payload.eventId] = action.payload.reviews;
    },
    upsertReview(
      state,
      action: PayloadAction<{ eventId: string; review: Review }>
    ) {
      const arr = state.byEvent[action.payload.eventId] ?? [];
      const filtered = arr.filter(
        (rating) =>
          rating.id !== action.payload.review.id &&
          rating.user.id !== action.payload.review.user.id
      );
      state.byEvent[action.payload.eventId] = [
        action.payload.review,
        ...filtered,
      ];
    },
    removeReview(
      state,
      action: PayloadAction<{ eventId: string; reviewId: string }>
    ) {
      const arr = state.byEvent[action.payload.eventId] ?? [];
      state.byEvent[action.payload.eventId] = arr.filter(
        (rating) => rating.id !== action.payload.reviewId
      );
    },
  },
});

export const reviewsReducer = slice.reducer;
export const { setLoading, setError, setReviews, upsertReview, removeReview } =
  slice.actions;

export const reviewsActions = slice.actions;
