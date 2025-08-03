import { useAppDispatch } from "@src/hooks/redux/useAppDispatch";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import { login as loginApi } from "@src/services/auth.api";
import type { User } from "../auth/auth.state";
import {
  logout as logoutAction,
  setAuth as setAuthAction,
} from "./slices/auth.slice";

export const useReduxAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, refreshToken, authInitialized } = useAppSelector(
    (state) => state.auth
  );

  const login = async (email: string, password: string) => {
    const {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    } = await loginApi({
      email,
      password,
    });
    dispatch(
      setAuthAction({ user, accessToken, refreshToken, authInitialized: true })
    );

    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const setAuth = (user: User, accessToken: string, refreshToken: string) => {
    dispatch(
      setAuthAction({ user, accessToken, refreshToken, authInitialized: true })
    );

    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const getAccessToken = () => accessToken;

  return {
    user,
    accessToken,
    refreshToken,
    authInitialized,
    login,
    logout,
    setAuth,
    getAccessToken,
  };
};
