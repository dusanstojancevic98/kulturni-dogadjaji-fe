import { featureFlags } from "@src/config/featureFlags";
import {
  logout as reduxLogout,
  setAuth as setAuthRedux,
} from "../redux/slices/auth.slice";
import { store as reduxStore } from "../redux/store";
import { authStore as zustandStore } from "../zustand/auth.store";
import type { User } from "./auth.state";

export const authController = {
  getAccessToken: () =>
    featureFlags.useRedux
      ? reduxStore.getState().auth.accessToken
      : zustandStore.getState().accessToken,

  getRefreshToken: () => {
    const memory = featureFlags.useRedux
      ? reduxStore.getState().auth.refreshToken
      : zustandStore.getState().refreshToken;
    return memory || localStorage.getItem("refreshToken");
  },

  setAuth: (user: User, accessToken: string, refreshToken: string) => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        setAuthRedux({ user, accessToken, refreshToken, authInitialized: true })
      );
    } else {
      zustandStore.setState({
        user,
        accessToken,
        refreshToken,
        authInitialized: true,
      });
    }
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(reduxLogout());
    } else {
      zustandStore.getState().logout();
    }

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const memory = featureFlags.useRedux
      ? reduxStore.getState().auth.user
      : zustandStore.getState().user;

    if (memory) return memory;

    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  },

  loadAuthFromStorage: () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const userRaw = localStorage.getItem("user");

    if (refreshToken && userRaw) {
      const user = JSON.parse(userRaw);
      authController.setAuth(user, "", refreshToken);
    }
  },
};
