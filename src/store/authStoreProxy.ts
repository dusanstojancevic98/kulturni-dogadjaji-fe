import { featureFlags } from "@src/config/featureFlags";
import { useAuthRedux } from "@src/hooks/redux/useAuthRedux";
import { useAuthZustand } from "@src/hooks/zustand/useAuthZustand";
import type { User } from "./auth/auth.state";
import {
  logout as reduxLogout,
  setAccessToken,
  setUser,
} from "./redux/slices/authSlice";
import { store as reduxStore, store } from "./redux/store";
import { authStore, authStore as zustandStore } from "./zustand/useAuthStore";

export const useAuth = featureFlags.useRedux ? useAuthRedux : useAuthZustand;

export const getAccessToken = () =>
  featureFlags.useRedux
    ? reduxStore.getState().auth.accessToken
    : zustandStore.getState().accessToken;

export const setAuthState = (user: User, token: string) => {
  if (featureFlags.useRedux) {
    store.dispatch(setUser(user));
    store.dispatch(setAccessToken(token));
  } else {
    authStore.getState().setUser(user);
    authStore.getState().setAccessToken(token);
  }
};

export const logout = () => {
  if (featureFlags.useRedux) {
    store.dispatch(reduxLogout());
  } else {
    authStore.getState().logout();
  }
};
