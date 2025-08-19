import type { Event } from "@src/models/event.types";
import { api } from "@src/services/api";

export const reserveEvent = async (eventId: string) => {
  const res = await api.post(`/reservations/${eventId}`);
  return res.data;
};

export const cancelReservation = async (eventId: string) => {
  const res = await api.delete(`/reservations/${eventId}`);
  return res.data as { ok: true };
};

export const myReservations = async () => {
  const res = await api.get(`/reservations/me`);
  return res.data as Array<{
    event: Event;
    createdAt: string;
  }>;
};

export const reservationStatus = async (eventId: string) => {
  const res = await api.get(`/reservations/${eventId}/status`);
  return (res.data?.reserved ?? false) as boolean;
};
