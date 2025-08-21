import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import type { Event } from "@src/models/event.types";
import {
  cancelReservation,
  myReservations,
  reserveEvent,
} from "@src/services/reservations.api";
import { store as reduxReservationsStore } from "@src/store/redux/store";
import { eventsController } from "../events/event.controller";
import { reservationsActions as reduxReservationsActions } from "../redux/slices/reservations.slice";
import { reservationsStore as zustandReservationsStore } from "../zustand/reservations.store";

export const reservationsController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxReservationsStore.getState().reservations
      : zustandReservationsStore.getState(),

  async loadMine() {
    try {
      const ids = await myReservations();
      const events = ids.map((reservation) => reservation.event);
      if (featureFlags.useRedux) {
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setAll(events)
        );
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setLoaded(true)
        );
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setError(null)
        );
      } else {
        const zustandActions = zustandReservationsStore.getState();
        zustandActions.setAll(events);
        zustandActions.setLoaded(true);
        zustandActions.setError(null);
      }
    } catch {
      const message = "Greška pri učitavanju rezervacija";
      if (featureFlags.useRedux) {
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setError(message)
        );
      } else {
        zustandReservationsStore.getState().setError(message);
      }
    }
  },

  async reserve(event: Event) {
    if (featureFlags.useRedux) {
      reduxReservationsStore.dispatch(
        reduxReservationsActions.setBusy({ eventId: event.id, value: true })
      );
      reduxReservationsStore.dispatch(reduxReservationsActions.add(event));
      try {
        await reserveEvent(event.id);
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setBusy({ eventId: event.id, value: false })
        );
      } catch (error) {
        reduxReservationsStore.dispatch(
          reduxReservationsActions.remove(event.id)
        );
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setBusy({ eventId: event.id, value: false })
        );
        throw error;
      }
    } else {
      const zustandActions = zustandReservationsStore.getState();
      zustandActions.setBusy(event.id, true);
      zustandActions.add(event);
      try {
        await reserveEvent(event.id);
        zustandActions.setBusy(event.id, false);
      } catch (error) {
        zustandActions.remove(event.id);
        zustandActions.setBusy(event.id, false);
        throw error;
      }
    }

    const eventFromStore = eventsController.getState().byId[event.id];
    eventsController.setDetailLocal(event.id, {
      _count: {
        favorites: eventFromStore?._count?.favorites ?? 0,
        reservations: (eventFromStore?._count?.reservations ?? 0) + 1,
      },
    });
  },

  async cancel(event: Event) {
    const eventId = event.id;
    if (featureFlags.useRedux) {
      reduxReservationsStore.dispatch(
        reduxReservationsActions.setBusy({ eventId, value: true })
      );
      reduxReservationsStore.dispatch(reduxReservationsActions.remove(eventId));
      try {
        await cancelReservation(event.id);
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setBusy({ eventId, value: false })
        );
      } catch (error) {
        reduxReservationsStore.dispatch(reduxReservationsActions.add(event));
        reduxReservationsStore.dispatch(
          reduxReservationsActions.setBusy({ eventId, value: false })
        );
        throw error;
      }
    } else {
      const zustandActions = zustandReservationsStore.getState();
      zustandActions.setBusy(eventId, true);
      zustandActions.remove(eventId);
      try {
        await cancelReservation(eventId);
        zustandActions.setBusy(eventId, false);
      } catch (error) {
        zustandActions.add(event);
        zustandActions.setBusy(eventId, false);
        throw error;
      }
    }

    const eventFromStore = eventsController.getState().byId[eventId];
    eventsController.setDetailLocal(eventId, {
      _count: {
        favorites: eventFromStore?._count?.favorites ?? 0,
        reservations: (eventFromStore?._count?.reservations ?? 0) - 1,
      },
    });
  },
};

export const useReservations = () => {
  const redux = useAppSelector((state) => state.reservations);
  const zustand = zustandReservationsStore();
  return featureFlags.useRedux ? redux : zustand;
};
