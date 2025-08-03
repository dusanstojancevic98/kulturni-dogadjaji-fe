import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { store } from "@src/store/redux/store";
import { Provider } from "react-redux";
import { AppRoutes } from "./routes";

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
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
