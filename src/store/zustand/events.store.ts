import type { Event, EventFilters } from "@src/models/event.types";
import {
  initialEventsState,
  type EventsState,
} from "@src/store/events/event.state";
import { create } from "zustand";

type EventsActions = {
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  setData: (items: Event[], total: number) => void;
  setFilters: (filters: EventFilters) => void;

  setEvent: (id: string, event: Event) => void;
  patchEvent: (id: string, patch: Partial<Event>) => void;
  removeEventFromList: (id: string) => void;
  upsertIntoList: (event: Event) => void;
};

export const eventsStore = create<EventsState & EventsActions>((set) => ({
  ...initialEventsState,

  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
  setData: (items, total) => set({ items, total }),
  setFilters: (filters) => set({ filters }),

  setEvent: (id, event) =>
    set((state) => ({ byId: { ...state.byId, [id]: event } })),
  patchEvent: (id, patch) =>
    set((state) => {
      const existing = state.byId[id];
      const byId = { ...state.byId };
      if (existing) byId[id] = { ...existing, ...patch };

      const items = state.items.map((ev) =>
        ev.id === id ? { ...ev, ...patch } : ev
      );
      return { byId, items };
    }),
  removeEventFromList: (id) =>
    set((state) => ({
      items: state.items.filter((event) => event.id !== id),
      total: Math.max(0, state.total - 1),
    })),
  upsertIntoList: (event) =>
    set((state) => {
      const exists = state.items.some(
        (existingEvent) => existingEvent.id === event.id
      );
      const items = exists
        ? state.items.map((existingEvent) =>
            existingEvent.id === event.id ? event : existingEvent
          )
        : [event, ...state.items];
      return { items, total: exists ? state.total : state.total + 1 };
    }),
}));
