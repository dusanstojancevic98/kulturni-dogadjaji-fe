import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import { getMyFavoriteIds, toggleFavorite } from "@src/services/favorites.api";
import { store as reduxStore } from "@src/store/redux/store";
import { eventsController } from "../events/event.controller";
import { favoritesActions as reduxFavActions } from "../redux/slices/favorites.slice";
import { favoritesStore as zustandFavStore } from "../zustand/favorites.store";

export const favoritesController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxStore.getState().favorites
      : zustandFavStore.getState(),

  isFavoriteLocal: (eventId: string): boolean => {
    const state = favoritesController.getState();
    return state.ids.includes(eventId);
  },

  async loadMine() {
    if (featureFlags.useRedux) {
      try {
        const ids = await getMyFavoriteIds();
        reduxStore.dispatch(reduxFavActions.setAll(ids));
        reduxStore.dispatch(reduxFavActions.setLoaded(true));
        reduxStore.dispatch(reduxFavActions.setError(null));
      } catch {
        reduxStore.dispatch(
          reduxFavActions.setError("Greška pri učitavanju omiljenih")
        );
      }
    } else {
      try {
        const ids = await getMyFavoriteIds();
        const zustandActions = zustandFavStore.getState();
        zustandActions.setAll(ids);
        zustandActions.setLoaded(true);
        zustandActions.setError(null);
      } catch {
        zustandFavStore.getState().setError("Greška pri učitavanju omiljenih");
      }
    }
  },

  async toggle(eventId: string) {
    const wasFavorite = favoritesController.isFavoriteLocal(eventId);
    let isFavorite = wasFavorite;
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        reduxFavActions.setToggling({ eventId, value: true })
      );
      reduxStore.dispatch(
        wasFavorite
          ? reduxFavActions.remove(eventId)
          : reduxFavActions.add(eventId)
      );
      try {
        const serverValue = await toggleFavorite(eventId);
        const nowFavorite = reduxStore
          .getState()
          .favorites.ids.includes(eventId);
        if (serverValue !== nowFavorite) {
          reduxStore.dispatch(
            serverValue
              ? reduxFavActions.add(eventId)
              : reduxFavActions.remove(eventId)
          );
          isFavorite = serverValue;
        }
        reduxStore.dispatch(
          reduxFavActions.setToggling({ eventId, value: false })
        );
      } catch {
        reduxStore.dispatch(
          wasFavorite
            ? reduxFavActions.add(eventId)
            : reduxFavActions.remove(eventId)
        );
        reduxStore.dispatch(
          reduxFavActions.setToggling({ eventId, value: false })
        );
        throw new Error("Greška pri menjanju omiljenih");
      }
    } else {
      const zustandActions = zustandFavStore.getState();
      zustandActions.setToggling(eventId, true);
      if (wasFavorite) {
        zustandActions.remove(eventId);
      } else {
        zustandActions.add(eventId);
      }
      try {
        const serverValue = await toggleFavorite(eventId);
        const isFavoriteNow = zustandFavStore.getState().ids.includes(eventId);
        if (serverValue !== isFavoriteNow) {
          isFavorite = serverValue;
          if (serverValue) {
            zustandActions.add(eventId);
          } else {
            zustandActions.remove(eventId);
          }
        }
        zustandActions.setToggling(eventId, false);
      } catch (error) {
        if (wasFavorite) {
          zustandActions.add(eventId);
        } else {
          zustandActions.remove(eventId);
        }
        zustandActions.setToggling(eventId, false);
        throw error;
      }
    }

    const delta = isFavorite ? -1 : 1;
    const eventFromStore = eventsController.getState().byId[eventId];
    eventsController.setDetailLocal(eventId, {
      _count: {
        favorites: Math.max(
          0,
          (eventFromStore?._count?.favorites ?? 0) + delta
        ),
        reservations: eventFromStore?._count?.reservations ?? 0,
      },
    });
  },
};

export const useFavorites = () => {
  const redux = useAppSelector((state) => state.favorites);
  const zustand = zustandFavStore();
  return featureFlags.useRedux ? redux : zustand;
};
