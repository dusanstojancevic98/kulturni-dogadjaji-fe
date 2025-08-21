export type EventRating = { avg: number; count: number };

export type RatingState = {
  byEvent: Record<string, EventRating>;
};

export const initialRatingState: RatingState = {
  byEvent: {},
};
