import { Button } from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { authController } from "@src/store/auth/auth.controller";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  onLogout?: () => void;
};

export const LogoutButton: FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authController.logout();
    navigate(ROUTES.LOGIN);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Button
      color="secondary"
      variant="contained"
      sx={{
        borderRadius: 0,
      }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};
