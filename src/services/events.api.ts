import type {
  EditableEventFields,
  Event,
  EventFilters,
  Paginated,
} from "@src/models/event.types";
import { api } from "@src/services/api";

export const getEvents = async (
  page = 1,
  pageSize = 12,
  filters: EventFilters = {}
): Promise<Paginated<Event>> => {
  const res = await api.get("/events", {
    params: { page, pageSize, ...filters },
  });
  return res.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (payload: {
  title: string;
  description: string;
  dateTime: string;
  type: string;
  capacity: number;
  imageUrl: string;
  institutionId: string;
}): Promise<Event> => {
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
