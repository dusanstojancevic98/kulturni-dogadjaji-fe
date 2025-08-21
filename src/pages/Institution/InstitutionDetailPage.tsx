import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { ROUTES } from "@src/constants/routes";
import type { Institution } from "@src/models/institution.types";
import { InstitutionTypeLabels } from "@src/models/institution.types";
import {
  deleteInstitution,
  getInstitutionById,
} from "@src/services/institutions.api";
import { useAuth } from "@src/store/auth/auth.controller";
import { UserRole } from "@src/store/auth/auth.state";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const InstitutionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [inst, setInst] = useState<Institution | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const snack = useSnack();
  const { user } = useAuth();

  const canEdit =
    !!user &&
    (user.role === UserRole.ADMIN || user.role === UserRole.ORGANIZER);
  const canDelete = !!user && user.role === UserRole.ADMIN;

  useEffect(() => {
    if (!id) return;
    (async () => setInst(await getInstitutionById(id)))();
  }, [id]);

  const onDelete = async () => {
    if (!id) return;
    try {
      await deleteInstitution(id);
      snack.success("Institucija obrisana");
      navigate(ROUTES.INSTITUTIONS);
    } catch {
      snack.error("Greška pri brisanju");
    }
  };

  if (!inst) {
    return (
      <Container sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="start"
        mb={2}
      >
        <Box>
          <Typography variant="h3">{inst.name}</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <Chip label={InstitutionTypeLabels[inst.type]} />
            <Chip label={inst.address} variant="outlined" />
            {typeof inst._count?.events === "number" && (
              <Chip
                label={`Događaji: ${inst._count.events}`}
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          {canEdit && (
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.INSTITUTION_EDIT(inst.id))}
            >
              Izmeni
            </Button>
          )}
          {canDelete && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              Obriši
            </Button>
          )}
        </Stack>
      </Stack>

      {inst.imageUrl && (
        <Box mb={2}>
          <img
            src={inst.imageUrl}
            alt={inst.name}
            style={{ maxWidth: "100%", borderRadius: 12 }}
          />
        </Box>
      )}

      <Typography variant="body1" gutterBottom>
        {inst.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {inst.contactEmail}
      </Typography>

      {inst.events && inst.events.length > 0 && (
        <>
          <Typography variant="h5" mt={3} mb={1}>
            Predstojeći događaji
          </Typography>
          <Grid container spacing={2}>
            {inst.events.map((ev) => (
              <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component={Link}
                  to={ROUTES.EVENT_DETAIL(ev.id)}
                  sx={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {ev.imageUrl && (
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1">{ev.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(ev.dateTime).format("DD.MM.YYYY HH:mm")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Obriši instituciju</DialogTitle>
        <DialogContent>
          Da li ste sigurni da želite da obrišete ovu instituciju?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Otkaži</Button>
          <Button color="error" onClick={onDelete}>
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
