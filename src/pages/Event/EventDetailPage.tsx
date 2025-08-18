import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { ROUTES } from "@src/constants/routes";
import { getDate } from "@src/helper/date";
import { EventTypeLabels, type Event } from "@src/models/event.types";
import { deleteEvent, getEventById } from "@src/services/events.api";
import { getMyFavoriteIds, toggleFavorite } from "@src/services/favorites.api";
import {
  cancelReservation,
  reservationStatus,
  reserveEvent,
} from "@src/services/reservations.api";
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
  const [fav, setFav] = useState(false);
  const [reserved, setReserved] = useState(false);

  const snack = useSnack();

  const canEdit =
    !!user && (user.role === UserRole.ADMIN || user.id === event?.createdById);

  useEffect(() => {
    if (!id) return;
    (async () => setEvent(await getEventById(id)))();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!user || !event?.id) {
        setFav(false);
        return;
      }
      const ids = await getMyFavoriteIds();
      setFav(ids.includes(event.id));
    })();
  }, [user, event?.id]);

  useEffect(() => {
    (async () => {
      if (!user || !event?.id) {
        setReserved(false);
        return;
      }
      const st = await reservationStatus(event.id);
      setReserved(st);
    })();
  }, [user, event?.id]);

  const doToggle = async () => {
    if (!event?.id) return;
    const res = await toggleFavorite(event.id);
    snack.info(fav ? "Uklonjeno iz omiljenih" : "Sačuvano u omiljene");
    setFav(res);
  };

  if (!event)
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Učitavanje...</Typography>
      </Container>
    );

  const dt = getDate(new Date(event.dateTime));
  const handleDelete = async () => {
    if (!id) return;
    await deleteEvent(id);
    navigate(ROUTES.EVENTS);
  };

  const seatsUsed = event?._count?.reservations ?? 0;
  const full = seatsUsed >= (event?.capacity ?? 0);

  const onReserve = async () => {
    if (!event?.id) return;
    try {
      await reserveEvent(event.id);
      setReserved(true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                ...prev._count,
                reservations: (prev._count?.reservations ?? 0) + 1,
                favorites: prev._count?.favorites ?? 0,
              },
            }
          : prev
      );
      snack.success("Rezervacija uspešna");
    } catch {
      snack.error("Greška pri rezervaciji");
    }
  };

  const onCancelReserve = async () => {
    if (!event?.id) return;
    try {
      await cancelReservation(event.id);
      setReserved(false);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                ...prev._count,
                reservations: Math.max(0, (prev._count?.reservations ?? 1) - 1),
                favorites: prev._count?.favorites ?? 0,
              },
            }
          : prev
      );
      snack.success("Rezervacija otkazana");
    } catch {
      snack.error("Greška pri otkazivanju");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => navigate(ROUTES.EVENTS)}
          sx={{ width: "40px", minWidth: "40px" }}
        >
          <UndoRoundedIcon />
        </Button>
        <Typography variant="h3" gutterBottom>
          {event.title}
        </Typography>
        <IconButton
          onClick={doToggle}
          sx={{
            bgcolor: "background.paper",
          }}
          aria-label={fav ? "Ukloni iz omiljenih" : "Sačuvaj u omiljene"}
        >
          {fav ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Stack>
      {canEdit && (
        <Stack direction="row" spacing={1} mb={2}>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.EVENT_EDIT(event!.id))}
          >
            Izmeni
          </Button>
          <Button
            variant="contained"
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

      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <Chip label={EventTypeLabels[event.type]} />
        <Chip label={`Kapacitet: ${event.capacity}`} variant="outlined" />
        <Chip label={`Rezervacije: ${seatsUsed}`} variant="outlined" />
        {user &&
          (reserved ? (
            <Button
              variant="contained"
              color="warning"
              onClick={onCancelReserve}
              sx={{ ml: "4px" }}
            >
              Otkaži rezervaciju
            </Button>
          ) : (
            <Button
              color={full ? "success" : "secondary"}
              variant="contained"
              disabled={full}
              onClick={onReserve}
              sx={{ ml: "4px" }}
            >
              {full ? "Popunjeno" : "Rezerviši"}
            </Button>
          ))}
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
