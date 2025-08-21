import type { Review } from "@src/models/review.types";

export type ReviewsState = {
  byEvent: Record<string, Review[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
};

export const initialReviewsState: ReviewsState = {
  byEvent: {},
  loading: {},
  error: {},
};
