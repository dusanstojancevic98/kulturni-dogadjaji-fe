import type { AlertColor } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SnackOptions = {
  severity?: AlertColor;
  duration?: number; // ms
};

type SnackContextValue = {
  show: (message: string, opts?: SnackOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
};

const SnackContext = createContext<SnackContextValue | undefined>(undefined);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [duration, setDuration] = useState<number>(2500);

  const show = useCallback((msg: string, opts?: SnackOptions) => {
    setMessage(msg);
    setSeverity(opts?.severity ?? "info");
    setDuration(opts?.duration ?? 2500);
    setOpen(true);
  }, []);

  const success = useCallback(
    (msg: string, d?: number) =>
      show(msg, { severity: "success", duration: d }),
    [show]
  );
  const error = useCallback(
    (msg: string, d?: number) => show(msg, { severity: "error", duration: d }),
    [show]
  );
  const info = useCallback(
    (msg: string, d?: number) => show(msg, { severity: "info", duration: d }),
    [show]
  );
  const warning = useCallback(
    (msg: string, d?: number) =>
      show(msg, { severity: "warning", duration: d }),
    [show]
  );

  const value = useMemo(
    () => ({ show, success, error, info, warning }),
    [show, success, error, info, warning]
  );

  return (
    <SnackContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnack = () => {
  const ctx = useContext(SnackContext);
  if (!ctx) throw new Error("useSnack must be used within <SnackbarProvider>");
  return ctx;
};
