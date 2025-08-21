import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Event, EventFilters } from "@src/models/event.types";
import { initialEventsState } from "@src/store/events/event.state";

const eventsSlice = createSlice({
  name: "events",
  initialState: initialEventsState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setData(state, action: PayloadAction<{ items: Event[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    setFilters(state, action: PayloadAction<Partial<EventFilters>>) {
      state.filters = { ...action.payload };
    },

    setEvent(state, action: PayloadAction<{ id: string; event: Event }>) {
      state.byId[action.payload.id] = action.payload.event;
    },
    patchEvent(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Event> }>
    ) {
      const existing = state.byId[action.payload.id];
      if (existing) {
        state.byId[action.payload.id] = {
          ...existing,
          ...action.payload.patch,
        };
      }
      state.items = state.items.map((event) =>
        event.id === action.payload.id
          ? { ...event, ...action.payload.patch }
          : event
      );
    },
    removeEventFromList(state, action: PayloadAction<string>) {
      state.items = state.items.filter((event) => event.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
    upsertIntoList(state, action: PayloadAction<Event>) {
      const exists = state.items.some(
        (event) => event.id === action.payload.id
      );
      if (exists) {
        state.items = state.items.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      } else {
        state.items = [action.payload, ...state.items];
        state.total += 1;
      }
    },
  },
});

export const eventsReducer = eventsSlice.reducer;
export const eventsActions = eventsSlice.actions;
