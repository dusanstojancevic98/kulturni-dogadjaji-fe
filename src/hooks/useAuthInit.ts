import { ROUTES } from "@src/constants/routes";
import { tryRefreshToken } from "@src/services/refreshToken";
import { useAuth } from "@src/store/auth/auth.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthInit = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const checkRefresh = async () => {
      const success = await tryRefreshToken();
      if (!success) {
        logout();
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    checkRefresh();
  }, []);
};
