import type { Event } from "@src/models/event.types";
import {
  initialReservationsState,
  type ReservationsState,
} from "@src/store/reservations/reservations.state";
import { create } from "zustand";

type ReservationsActions = {
  setLoaded: (value: boolean) => void;
  setError: (message: string | null) => void;
  setAll: (events: Event[]) => void;
  add: (event: Event) => void;
  remove: (eventId: string) => void;
  setBusy: (eventId: string, value: boolean) => void;
};

export const reservationsStore = create<
  ReservationsState & ReservationsActions
>((set) => ({
  ...initialReservationsState,
  setLoaded: (value) => set({ loaded: value }),
  setError: (message) => set({ error: message }),
  setAll: (events) => set({ reservedEvents: events }),
  add: (event) =>
    set((state) => ({
      reservedEvents: state.reservedEvents.includes(event)
        ? state.reservedEvents
        : [...state.reservedEvents, event],
    })),
  remove: (eventId) =>
    set((state) => ({
      reservedEvents: state.reservedEvents.filter(
        (event) => event.id !== eventId
      ),
    })),
  setBusy: (eventId, value) =>
    set((state) => ({
      reservedById: { ...state.reservedById, [eventId]: value },
    })),
}));
