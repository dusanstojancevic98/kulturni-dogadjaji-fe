import type {
  EditableEventFields,
  Event,
  EventFilters,
  EventRating,
} from "@src/models/event.types";
import { api, type Paginated } from "@src/services/api";

export const getEvents = async (
  filters: EventFilters = {}
): Promise<Paginated<Event>> => {
  const res = await api.get("/events", {
    params: { ...filters },
  });
  return res.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  dateTime: string;
  type: string;
  capacity: number;
  imageUrl: string;
  institutionId: string;
};

export const createEvent = async (
  payload: CreateEventPayload
): Promise<Event> => {
  const res = await api.post("/events", payload);
  return res.data;
};

export const updateEvent = async (
  id: string,
  payload: Partial<EditableEventFields>
): Promise<Event> => {
  const res = await api.put(`/events/${id}`, payload);
  return res.data;
};

export const deleteEvent = async (id: string): Promise<{ ok: true }> => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

export const getMyEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events/my");
  return res.data;
};

export const getEventRating = async (eventId: string): Promise<EventRating> => {
  const res = await api.get(`/events/${eventId}/rating`);
  return res.data as EventRating;
};
