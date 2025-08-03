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
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [open, setOpen] = React.useState(false);

  useAuthInit();

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

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
          <List>
            <ListItemButton component={Link} to={ROUTES.DASHBOARD}>
              <ListItemText primary="Početna" />
            </ListItemButton>
            <ListItemButton component={Link} to={ROUTES.LOGIN}>
              <ListItemText primary="Prijava" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
