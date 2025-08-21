import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialFavoritesState } from "@src/store/favorites/favorite.state";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState,
  reducers: {
    setLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setAll(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    add(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) state.ids.push(action.payload);
    },
    remove(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((eventId) => eventId !== action.payload);
    },
    setToggling(
      state,
      action: PayloadAction<{ eventId: string; value: boolean }>
    ) {
      state.loadingById[action.payload.eventId] = action.payload.value;
    },
  },
});

export const favoritesReducer = favoritesSlice.reducer;
export const favoritesActions = favoritesSlice.actions;
