import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import {
  changePassword,
  getMe,
  updateMe,
  type Profile,
} from "@src/services/users.api";
import { authController } from "@src/store/auth/auth.controller";
import { UserRoleLabel } from "@src/store/auth/auth.state";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ProfileForm = { name: string; email: string };
type PasswordForm = { currentPassword: string; newPassword: string };

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const snack = useSnack();

  const pf = useForm<ProfileForm>({ defaultValues: { name: "", email: "" } });
  const pw = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  useEffect(() => {
    (async () => {
      const me = await getMe();
      setProfile(me);
      pf.reset({ name: me.name, email: me.email });
    })();
  }, []);

  const onSaveProfile = async (data: ProfileForm) => {
    try {
      const updated = await updateMe(data);
      setProfile(updated);
      const tokens = {
        accessToken: authController.getAccessToken(),
        refreshToken: authController.getRefreshToken() || "",
      };
      authController.setAuth(
        {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role,
        },
        tokens.accessToken || "",
        tokens.refreshToken
      );
      snack.success("Profil sačuvan");
    } catch {
      snack.error("Greška pri čuvanju");
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    try {
      await changePassword(data);
      pw.reset();
      snack.success("Lozinka promenjena");
    } catch {
      snack.error("Greška pri promeni lozinke");
    }
  };

  if (!profile)
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Učitavanje…</Typography>
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Moj profil
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={pf.handleSubmit(onSaveProfile)}>
          <Stack spacing={2}>
            <TextField
              label="Ime i prezime"
              {...pf.register("name", {
                required: "Obavezno",
                minLength: { value: 2, message: "Min 2 karaktera" },
              })}
              error={!!pf.formState.errors.name}
              helperText={pf.formState.errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              {...pf.register("email", { required: "Obavezno" })}
              error={!!pf.formState.errors.email}
              helperText={pf.formState.errors.email?.message}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Uloga: {UserRoleLabel[profile.role]}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                Sačuvaj
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={1}>
          Promena lozinke
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={pw.handleSubmit(onChangePassword)}>
          <Stack spacing={2}>
            <TextField
              label="Trenutna lozinka"
              type="password"
              {...pw.register("currentPassword", { required: "Obavezno" })}
              error={!!pw.formState.errors.currentPassword}
              helperText={pw.formState.errors.currentPassword?.message}
            />
            <TextField
              label="Nova lozinka"
              type="password"
              {...pw.register("newPassword", {
                required: "Obavezno",
                minLength: { value: 8, message: "Minimum 8 karaktera" },
              })}
              error={!!pw.formState.errors.newPassword}
              helperText={pw.formState.errors.newPassword?.message}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="outlined">
                Promeni lozinku
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
