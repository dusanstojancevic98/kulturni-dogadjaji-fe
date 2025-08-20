import { Box, CircularProgress } from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { useAuth } from "@src/store/auth/auth.store";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: Props) => {
  const { accessToken, authInitialized } = useAuth();
  if (!authInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (accessToken) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
