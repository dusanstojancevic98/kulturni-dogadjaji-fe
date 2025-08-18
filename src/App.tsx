import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { store } from "@src/store/redux/store";
import "dayjs/locale/sr";
import { Provider } from "react-redux";
import { SnackbarProvider } from "./components/common/snackbar/SnachbarProvider";
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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
          <SnackbarProvider>
            <AppRoutes />
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
