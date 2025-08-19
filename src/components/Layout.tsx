import {
  AccountCircle as AccountCircleIcon,
  Bookmark as BookmarkIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  EventNote as EventNoteIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Workspaces as WorkspacesIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { useAuthInit } from "@src/hooks/useAuthInit";
import { UserRole } from "@src/store/auth/auth.state";
import { useAuth } from "@src/store/auth/auth.store";
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Početna" />
                    </ListItemButton>

                    <ListItemButton component={Link} to={ROUTES.PROFILE}>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moj profil" />
                    </ListItemButton>

                    <ListItemButton component={Link} to={ROUTES.EVENTS}>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText primary="Događaji" />
                    </ListItemButton>

                    <ListItemButton component={Link} to={ROUTES.MY_FAVORITES}>
                      <ListItemIcon>
                        <FavoriteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moje omiljene" />
                    </ListItemButton>

                    <ListItemButton
                      component={Link}
                      to={ROUTES.MY_RESERVATIONS}
                    >
                      <ListItemIcon>
                        <BookmarkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moje rezervacije" />
                    </ListItemButton>

                    {(user.role === UserRole.ORGANIZER ||
                      user.role === UserRole.ADMIN) && (
                      <>
                        <ListItemButton component={Link} to={ROUTES.MY_EVENTS}>
                          <ListItemIcon>
                            <EventNoteIcon />
                          </ListItemIcon>
                          <ListItemText primary="Moji događaji" />
                        </ListItemButton>

                        <ListItemButton
                          component={Link}
                          to={ROUTES.INSTITUTIONS}
                        >
                          <ListItemIcon>
                            <BusinessIcon />
                          </ListItemIcon>
                          <ListItemText primary="Institucije" />
                        </ListItemButton>

                        <ListItemButton
                          component={NavLink}
                          to={ROUTES.DASHBOARD}
                          end
                        >
                          <ListItemIcon>
                            <WorkspacesIcon />
                          </ListItemIcon>
                          <ListItemText primary="Dashboard" />
                        </ListItemButton>
                      </>
                    )}

                    {user?.role === UserRole.ADMIN && (
                      <ListItemButton
                        component={NavLink}
                        to={ROUTES.ADMIN_USERS}
                        end
                      >
                        <ListItemIcon>
                          <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Korisnici" />
                      </ListItemButton>
                    )}
                  </>
                ) : (
                  <>
                    <ListItemButton component={Link} to={ROUTES.LOGIN}>
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary="Prijavi se" />
                    </ListItemButton>

                    <ListItemButton component={Link} to={ROUTES.REGISTER}>
                      <ListItemIcon>
                        <PersonAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Registruj se" />
                    </ListItemButton>
                  </>
                )}
              </List>
            </Box>
            ;
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
