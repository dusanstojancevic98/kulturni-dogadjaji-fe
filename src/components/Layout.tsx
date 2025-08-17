import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { useAuthInit } from "@src/hooks/useAuthInit";
import { useAuth } from "@src/store/auth/auth.store";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { LogoutButton } from "./LogoutButton";

export default function AppLayout() {
  const [open, setOpen] = React.useState(false);
  useAuthInit();
  const { user, authInitialized } = useAuth();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Kulturni Događaji
          </Typography>
        </Toolbar>
      </AppBar>

      {authInitialized && (
        <Drawer open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
              <List>
                {user ? (
                  <>
                    <ListItemButton component={Link} to={ROUTES.DASHBOARD}>
                      <ListItemText primary="Početna" />
                    </ListItemButton>
                    <ListItemButton component={Link} to={ROUTES.EVENTS}>
                      <ListItemText primary="Događaji" />
                    </ListItemButton>
                  </>
                ) : (
                  <>
                    <ListItemButton component={Link} to={ROUTES.LOGIN}>
                      <ListItemText primary="Prijavi se" />
                    </ListItemButton>
                    <ListItemButton component={Link} to={ROUTES.REGISTER}>
                      <ListItemText primary="Registruj se" />
                    </ListItemButton>
                  </>
                )}
              </List>
            </Box>
            {authInitialized && user && (
              <LogoutButton onLogout={() => setOpen(false)} />
            )}
          </Box>
        </Drawer>
      )}

      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
