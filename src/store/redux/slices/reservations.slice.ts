import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Event } from "@src/models/event.types";
import { initialReservationsState } from "@src/store/reservations/reservations.state";

const reservationsSlice = createSlice({
  name: "reservations",
  initialState: initialReservationsState,
  reducers: {
    setLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setAll(state, action: PayloadAction<Event[]>) {
      state.reservedEvents = action.payload;
    },
    add(state, action: PayloadAction<Event>) {
      if (!state.reservedEvents.some((e) => e.id === action.payload.id))
        state.reservedEvents.push(action.payload);
    },
    remove(state, action: PayloadAction<string>) {
      state.reservedEvents = state.reservedEvents.filter(
        (event) => event.id !== action.payload
      );
    },
    setBusy(state, action: PayloadAction<{ eventId: string; value: boolean }>) {
      state.reservedById[action.payload.eventId] = action.payload.value;
    },
  },
});

export const reservationsReducer = reservationsSlice.reducer;
export const reservationsActions = reservationsSlice.actions;
