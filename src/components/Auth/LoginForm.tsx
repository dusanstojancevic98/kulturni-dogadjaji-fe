import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { login } from "@src/services/auth.api";
import { setAuthState } from "@src/store/authStoreProxy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user, access_token } = await login({ email, password });
      setAuthState(user, access_token);
      navigate("/");
    } catch {
      setError("Pogrešan email ili lozinka.");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Prijava
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Lozinka"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Prijavi se
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Paper>
  );
};
