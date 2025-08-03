import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { router } from "@src/routes";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: `'Open Sans', sans-serif`,
    h1: { fontFamily: `'Montserrat', sans-serif` },
    h2: { fontFamily: `'Montserrat', sans-serif` },
    h3: { fontFamily: `'Montserrat', sans-serif` },
    h4: { fontFamily: `'Montserrat', sans-serif` },
    h5: { fontFamily: `'Montserrat', sans-serif` },
    h6: { fontFamily: `'Montserrat', sans-serif` },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
