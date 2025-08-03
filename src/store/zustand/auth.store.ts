import {
  type AuthState,
  initialAuthState,
  type User,
} from "@src/store/auth/auth.state";
import { create } from "zustand";

type AuthActions = {
  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string,
    authInitialized: boolean
  ) => void;
  logout: () => void;
};

export const authStore = create<AuthState & AuthActions>((set) => ({
  ...initialAuthState,

  setAuth: (user, accessToken, refreshToken, authInitialized) =>
    set({ user, accessToken, refreshToken, authInitialized }),
  logout: () => set({ ...initialAuthState, authInitialized: false }),
}));

export const useZustandAuthStore = authStore;
