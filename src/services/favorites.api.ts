import { api } from "@src/services/api";

export const getMyFavoriteIds = async (): Promise<string[]> => {
  const res = await api.get("/favorites/me");
  return (res.data?.eventIds ?? []) as string[];
};

export const toggleFavorite = async (eventId: string): Promise<boolean> => {
  const res = await api.post(`/favorites/${eventId}/toggle`);
  return Boolean(res.data?.favorited);
};
