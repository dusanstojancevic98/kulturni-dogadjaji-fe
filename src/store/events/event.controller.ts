import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import type { Event, EventFilters } from "@src/models/event.types";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getMyEvents,
  updateEvent,
  type CreateEventPayload,
} from "@src/services/events.api";
import { eventsActions } from "@src/store/redux/slices/events.slice";
import { store as reduxStore } from "@src/store/redux/store";
import { eventsStore } from "@src/store/zustand/events.store";

export const eventsController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxStore.getState().events
      : eventsStore.getState(),

  setFilters: (filters: EventFilters) => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.setFilters(filters));
    } else {
      eventsStore.getState().setFilters(filters);
    }
  },

  async loadList() {
    const { filters } = eventsController.getState();

    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.setLoading(true));
      try {
        const response = await getEvents(filters);
        reduxStore.dispatch(
          eventsActions.setData({
            items: response.items,
            total: response.total,
          })
        );
        reduxStore.dispatch(eventsActions.setError(null));
      } catch {
        reduxStore.dispatch(
          eventsActions.setError("Greška pri učitavanju događaja")
        );
      } finally {
        reduxStore.dispatch(eventsActions.setLoading(false));
      }
    } else {
      const storeApi = eventsStore.getState();
      storeApi.setLoading(true);
      try {
        const response = await getEvents(filters);
        storeApi.setData(response.items, response.total);
        storeApi.setError(null);
      } catch {
        storeApi.setError("Greška pri učitavanju događaja");
      } finally {
        storeApi.setLoading(false);
      }
    }
  },

  async loadMine() {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.setLoading(true));
      try {
        const response = await getMyEvents();
        reduxStore.dispatch(
          eventsActions.setData({
            items: response,
            total: response.length,
          })
        );
        reduxStore.dispatch(eventsActions.setError(null));
      } catch {
        reduxStore.dispatch(
          eventsActions.setError("Greška pri učitavanju događaja")
        );
      } finally {
        reduxStore.dispatch(eventsActions.setLoading(false));
      }
    } else {
      const storeApi = eventsStore.getState();
      storeApi.setLoading(true);
      try {
        const response = await getMyEvents();
        storeApi.setData(response, response.length);
        storeApi.setError(null);
      } catch {
        storeApi.setError("Greška pri učitavanju događaja");
      } finally {
        storeApi.setLoading(false);
      }
    }
  },

  async ensureDetailLoaded(eventId: string) {
    const current = eventsController.getState().byId[eventId];
    if (current) return current;

    const fetched = await getEventById(eventId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        eventsActions.setEvent({ id: eventId, event: fetched })
      );
    } else {
      eventsStore.getState().setEvent(eventId, fetched);
    }
    return fetched;
  },

  setDetailLocal(eventId: string, patch: Partial<Event>) {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.patchEvent({ id: eventId, patch }));
    } else {
      eventsStore.getState().patchEvent(eventId, patch);
    }
  },

  async create(payload: CreateEventPayload) {
    const created = await createEvent(payload);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.upsertIntoList(created));
      reduxStore.dispatch(
        eventsActions.setEvent({ id: created.id, event: created })
      );
    } else {
      const api = eventsStore.getState();
      api.upsertIntoList(created);
      api.setEvent(created.id, created);
    }
    return created;
  },

  async update(eventId: string, payload: Partial<Event>) {
    const updated = await updateEvent(eventId, payload);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        eventsActions.patchEvent({ id: eventId, patch: updated })
      );
    } else {
      eventsStore.getState().patchEvent(eventId, updated);
    }
    return updated;
  },

  async remove(eventId: string) {
    await deleteEvent(eventId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(eventsActions.removeEventFromList(eventId));
    } else {
      eventsStore.getState().removeEventFromList(eventId);
    }
  },
};

export const useEvents = () => {
  const redux = useAppSelector((state) => state.events);
  const zustand = eventsStore();
  return featureFlags.useRedux ? redux : zustand;
};
