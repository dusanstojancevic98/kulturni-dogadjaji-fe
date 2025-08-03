import { login as loginApi } from "@src/services/auth.api";
import { useZustandAuthStore } from "./auth.store";

export const useZustandAuth = () => {
  const { user, accessToken, refreshToken, authInitialized, setAuth, logout } =
    useZustandAuthStore();

  const login = async (email: string, password: string) => {
    const {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    } = await loginApi({
      email,
      password,
    });
    setAuth(user, accessToken, refreshToken, true);
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
