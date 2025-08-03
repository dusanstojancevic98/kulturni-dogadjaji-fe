import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { register } from "@src/services/auth.api";
import { useAuth } from "@src/store/auth/auth.store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(1, "Ime je obavezno"),
    email: z.email("Neispravan email"),
    password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof schema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const {
        user,
        access_token: accessToken,
        refresh_token: refreshToken,
      } = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(user, accessToken, refreshToken, true);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Registracija
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Ime"
          {...formRegister("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          {...formRegister("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Lozinka"
          type="password"
          {...formRegister("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Ponovi lozinku"
          type="password"
          {...formRegister("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button variant="contained" type="submit">
          Registruj se
        </Button>
      </Box>
    </Paper>
  );
};
