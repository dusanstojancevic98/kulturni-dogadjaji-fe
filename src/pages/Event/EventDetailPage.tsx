import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { getDate } from "@src/helper/date";
import { EventTypeLabels, type Event } from "@src/models/event.types";
import { deleteEvent, getEventById } from "@src/services/events.api";
import { UserRole } from "@src/store/auth/auth.state";
import { useAuth } from "@src/store/auth/auth.store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canEdit =
    !!user && (user.role === UserRole.ADMIN || user.id === event?.createdById);

  console.log("EventDetailPage user:", user, event);

  useEffect(() => {
    if (!id) return;
    (async () => setEvent(await getEventById(id)))();
  }, [id]);

  if (!event)
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Učitavanje...</Typography>
      </Container>
    );

  const dt = getDate(new Date(event.dateTime).toLocaleString());
  const handleDelete = async () => {
    if (!id) return;
    await deleteEvent(id);
    navigate(ROUTES.EVENTS);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {event.title}
      </Typography>
      {canEdit && (
        <Stack direction="row" spacing={1} mb={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.EVENT_EDIT(event!.id))}
          >
            Izmeni
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmOpen(true)}
          >
            Obriši
          </Button>
        </Stack>
      )}
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {dt}
        {event.institution?.name ? ` — ${event.institution.name}` : ""}
      </Typography>

      <Stack direction="row" spacing={1} mb={2}>
        <Chip label={EventTypeLabels[event.type]} />
        <Chip label={`Kapacitet: ${event.capacity}`} variant="outlined" />
        {event._count && (
          <Chip
            label={`Rezervacije: ${event._count.reservations}`}
            variant="outlined"
          />
        )}
      </Stack>

      {event.imageUrl && (
        <Box mb={2}>
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ maxWidth: "100%", borderRadius: 12 }}
          />
        </Box>
      )}

      <Typography variant="body1">{event.description}</Typography>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Obriši događaj</DialogTitle>
        <DialogContent>
          Da li ste sigurni da želite da obrišete ovaj događaj?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Otkaži</Button>
          <Button color="error" onClick={handleDelete}>
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
