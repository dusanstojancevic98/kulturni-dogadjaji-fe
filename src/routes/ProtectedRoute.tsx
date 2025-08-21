import { Box, CircularProgress } from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { useAuth } from "@src/store/auth/auth.controller";
import type { UserRole } from "@src/store/auth/auth.state";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  roles?: UserRole[];
};

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { accessToken, authInitialized, user } = useAuth();
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

  if (!accessToken || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return <>{children}</>;
};
