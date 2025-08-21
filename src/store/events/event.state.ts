import type { Event, EventFilters } from "@src/models/event.types";

export type EventsState = {
  items: Event[];
  total: number;
  loading: boolean;
  error?: string | null;
  filters: EventFilters;

  byId: Record<string, Event | undefined>;
};

export const initialEventsState: EventsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 12,
    sort: "date",
    order: "asc",
  },
  byId: {},
};
