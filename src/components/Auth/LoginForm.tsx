import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { useAuth } from "@src/store/auth/auth.controller";
import { UserRole } from "@src/store/auth/auth.state";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof schema>;

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const user = await login(data.email, data.password);
      if (user.role === UserRole.VISITOR) {
        navigate(ROUTES.EVENTS);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch {
      setError("email", { message: "Pogrešan email ili lozinka" });
      setError("password", { message: " " });
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Prijava
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Lozinka"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button variant="contained" type="submit">
          Prijavi se
        </Button>
      </Box>
    </Paper>
  );
};
