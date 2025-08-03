import { type AuthState, initialAuthState } from "@src/store/auth/auth.state";
import { create } from "zustand";

type AuthActions = {
  setUser: (user: AuthState["user"]) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
};

export const authStore = create<AuthState & AuthActions>((set) => ({
  ...initialAuthState,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ ...initialAuthState }),
}));

export const useZustandAuthStore = authStore;
