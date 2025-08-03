import { useZustandAuthStore } from "@src/store/zustand/useAuthStore";

export const useAuthZustand = () => {
  const { user, accessToken, logout } = useZustandAuthStore();

  return {
    user,
    accessToken,
    logout,
  };
};
