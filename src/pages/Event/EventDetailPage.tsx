import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
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
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { EventMap } from "@src/components/map/EventMap";
import { ROUTES } from "@src/constants/routes";
import { getDate } from "@src/helper/date";
import { EventTypeLabels } from "@src/models/event.types";
import { deleteEvent, getEventRating } from "@src/services/events.api";
import { addReview } from "@src/services/review.api";
import { useAuth } from "@src/store/auth/auth.controller";
import { UserRole } from "@src/store/auth/auth.state";
import {
  eventsController,
  useEvents,
} from "@src/store/events/event.controller";
import {
  favoritesController,
  useFavorites,
} from "@src/store/favorites/favorite.controller";
import {
  ratingController,
  useRatings,
} from "@src/store/rating/rating.controller";
import {
  reservationsController,
  useReservations,
} from "@src/store/reservations/reservations.controller";
import {
  reviewsController,
  useReviews,
} from "@src/store/reviews/reviews.controller";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const snack = useSnack();

  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const event = useEvents().byId[id ?? ""] ?? null;
  const { reservedEvents } = useReservations();
  const reserved = reservedEvents.some((e) => e.id === id);

  const { ids } = useFavorites();
  const fav = ids.includes(id ?? "");

  const ratingAgg = useRatings(event?.id);
  const reviews = useReviews(event?.id);

  const canEdit =
    !!user && (user.role === UserRole.ADMIN || user.id === event?.createdById);

  useEffect(() => {
    if (id) {
      eventsController.ensureDetailLoaded(id);
      if (user) {
        reviewsController.loadReviews(id);
        ratingController.ensureLoaded(id);
        favoritesController.loadMine();
        reservationsController.loadMine();
      }
    }
  }, [id, user]);

  const doToggle = async () => {
    if (!event?.id) return;
    favoritesController.toggle(event.id);
    snack.info(fav ? "Uklonjeno iz omiljenih" : "Sačuvano u omiljene");
  };

  if (!event)
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
      reservationsController.reserve(event);
      snack.success("Rezervacija uspešna");
    } catch {
      snack.error("Greška pri rezervaciji");
    }
  };

  const onCancelReserve = async () => {
    if (!event?.id) return;
    try {
      reservationsController.cancel(event);
      snack.success("Rezervacija otkazana");
    } catch {
      snack.error("Greška pri otkazivanju");
    }
  };

  const handleRating = async () => {
    if (!event?.id || !rating || !user) return;
    await addReview(event.id, rating, comment);
    reviewsController.addOrUpdate(event.id, rating, comment);
    const agg = await getEventRating(event.id);
    ratingController.set(event.id, agg);
    setRating(null);
    setComment("");
    snack.success("Uspešno dodato");
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!event?.id) return;
    reviewsController.remove(event.id, reviewId);
  };

  const lat = event?.institution?.latitude ?? null;
  const lng = event?.institution?.longitude ?? null;

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
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Rating value={ratingAgg.avg} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary">
          {ratingAgg.avg.toFixed(1)} ({ratingAgg.count})
        </Typography>
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

      {lat != null && lng != null && (
        <EventMap
          lat={lat}
          lng={lng}
          title={`${event.institution?.name ?? ""} — ${event.title}`}
          height={320}
        />
      )}

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
      {user && (
        <Box mt={3}>
          <Typography variant="h6">Ostavi komentar</Typography>
          <Rating value={rating} onChange={(_, val) => setRating(val)} />
          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tvoj komentar..."
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            disabled={!rating}
            onClick={handleRating}
          >
            Pošalji
          </Button>
        </Box>
      )}
      <Box mt={3}>
        <Typography variant="h6">Komentari</Typography>
        {reviews.map((rating) => (
          <Box key={rating.id} sx={{ borderBottom: "1px solid #ddd", py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">{rating.user.name}</Typography>
              <Rating value={rating.rating} readOnly size="small" />
            </Stack>
            {rating.comment && <Typography>{rating.comment}</Typography>}
            {user?.id === rating.user.id && (
              <Button
                color="error"
                size="small"
                onClick={() => handleDeleteReview(rating.id)}
              >
                Obriši
              </Button>
            )}
          </Box>
        ))}
      </Box>

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
