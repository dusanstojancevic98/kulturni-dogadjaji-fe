import type { Institution } from "./institution.types";

export enum EventType {
  CONCERT = "CONCERT",
  EXHIBITION = "EXHIBITION",
  THEATER = "THEATER",
  FESTIVAL = "FESTIVAL",
}

export const EventTypeLabels: Record<EventType, string> = {
  [EventType.CONCERT]: "Koncert",
  [EventType.EXHIBITION]: "Izložba",
  [EventType.THEATER]: "Pozorište",
  [EventType.FESTIVAL]: "Festival",
};

export type EditableEventFields = Pick<
  Event,
  | "title"
  | "description"
  | "dateTime"
  | "type"
  | "capacity"
  | "imageUrl"
  | "institutionId"
>;

export type EventRating = { avg: number; count: number };

export type Event = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  type: EventType;
  capacity: number;
  imageUrl: string;
  createdById: string;
  institutionId: string;
  institution?: Institution;
  createdBy?: { id: string; name: string; email: string };
  _count?: { favorites: number; reservations: number };
  rating?: EventRating;
};

export type EventFilters = {
  q?: string;
  type?: EventType;
  from?: string;
  to?: string;
  institutionId?: string;
  page?: number;
  pageSize?: number;
  sort?: "date" | "title" | "favorites" | "reservations";
  order?: "asc" | "desc";
};
