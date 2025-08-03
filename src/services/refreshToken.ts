import { authController } from "@src/store/auth/auth.controller";
import { refresh } from "./auth.api";

export const tryRefreshToken = async () => {
  const refreshTokenStore = authController.getRefreshToken();
  const user = authController.getUser();

  if (!refreshTokenStore || !user?.id) return false;

  try {
    const res = await refresh({
      userId: user.id,
      refresh_token: refreshTokenStore,
    });

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: newUser,
    } = res;

    authController.setAuth(newUser, accessToken, refreshToken);

    return true;
  } catch {
    authController.logout();
    console.warn("Osvežavanje tokena nije uspelo.");
    return false;
  }
};
