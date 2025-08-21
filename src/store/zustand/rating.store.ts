import { create } from "zustand";
import {
  initialRatingState,
  type EventRating,
  type RatingState,
} from "../rating/rating.state";

type RatingActions = {
  setRating: (eventId: string, rating: EventRating) => void;
};

export const ratingStore = create<RatingState & RatingActions>((set) => ({
  ...initialRatingState,
  setRating: (eventId, rating) =>
    set((s) => ({ byEvent: { ...s.byEvent, [eventId]: rating } })),
}));
