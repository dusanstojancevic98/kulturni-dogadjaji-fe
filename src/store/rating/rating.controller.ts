import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import { getEventRating } from "@src/services/events.api";
import { store as reduxStore } from "@src/store/redux/store";
import { ratingActions } from "../redux/slices/rating.slice";
import { ratingStore } from "../zustand/rating.store";
import type { EventRating } from "./rating.state";

export const ratingController = {
  get: (eventId: string): EventRating | undefined => {
    return featureFlags.useRedux
      ? reduxStore.getState().rating.byEvent[eventId]
      : ratingStore.getState().byEvent[eventId];
  },

  ensureLoaded: async (eventId: string) => {
    const cached = ratingController.get(eventId);
    if (cached) return cached;
    const r = await getEventRating(eventId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(ratingActions.setRating({ eventId, rating: r }));
    } else {
      ratingStore.getState().setRating(eventId, r);
    }
    return r;
  },

  set: (eventId: string, r: EventRating) => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(ratingActions.setRating({ eventId, rating: r }));
    } else {
      ratingStore.getState().setRating(eventId, r);
    }
  },
};

export const useRatings = (eventId: string = "") => {
  const redux = useAppSelector(
    (state) =>
      state.rating.byEvent[eventId] ?? {
        avg: 0,
        count: 0,
      }
  );
  const zustand = ratingStore().byEvent[eventId] ?? {
    avg: 0,
    count: 0,
  };
  return featureFlags.useRedux ? redux : zustand;
};
