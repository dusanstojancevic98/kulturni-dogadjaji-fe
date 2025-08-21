import type { Event } from "@src/models/event.types";

export type ReservationsState = {
  reservedEvents: Event[];
  reservedById: Record<string, boolean>;
  loaded: boolean;
  error?: string | null;
};

export const initialReservationsState: ReservationsState = {
  reservedEvents: [],
  reservedById: {},
  loaded: false,
  error: null,
};
