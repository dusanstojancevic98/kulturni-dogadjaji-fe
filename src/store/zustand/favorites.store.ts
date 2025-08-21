import {
  initialFavoritesState,
  type FavoritesState,
} from "@src/store/favorites/favorite.state";
import { create } from "zustand";

type FavoritesActions = {
  setLoaded: (value: boolean) => void;
  setError: (message: string | null) => void;
  setAll: (ids: string[]) => void;
  add: (eventId: string) => void;
  remove: (eventId: string) => void;
  setToggling: (eventId: string, value: boolean) => void;
};

export const favoritesStore = create<FavoritesState & FavoritesActions>(
  (set) => ({
    ...initialFavoritesState,
    setLoaded: (value) => set({ loaded: value }),
    setError: (message) => set({ error: message }),
    setAll: (ids) => set({ ids }),
    add: (eventId) =>
      set((state) => ({
        ids: state.ids.includes(eventId) ? state.ids : [...state.ids, eventId],
      })),
    remove: (eventId) =>
      set((state) => ({ ids: state.ids.filter((id) => id !== eventId) })),
    setToggling: (eventId, value) =>
      set((state) => ({
        loadingById: { ...state.loadingById, [eventId]: value },
      })),
  })
);
