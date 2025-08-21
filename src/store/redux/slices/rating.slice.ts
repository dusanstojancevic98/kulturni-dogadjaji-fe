import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialRatingState,
  type EventRating,
} from "@src/store/rating/rating.state";

const slice = createSlice({
  name: "rating",
  initialState: initialRatingState,
  reducers: {
    setRating(
      state,
      action: PayloadAction<{ eventId: string; rating: EventRating }>
    ) {
      state.byEvent[action.payload.eventId] = action.payload.rating;
    },
  },
});

export const ratingReducer = slice.reducer;
export const { setRating } = slice.actions;
export const ratingActions = slice.actions;
