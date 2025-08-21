export type FavoritesState = {
  ids: string[];
  loadingById: Record<string, boolean>;
  loaded: boolean;
  error?: string | null;
};

export const initialFavoritesState: FavoritesState = {
  ids: [],
  loadingById: {},
  loaded: false,
  error: null,
};
