import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import { EventTypeLabels, type Event } from "@src/models/event.types";
import { useAuth } from "@src/store/auth/auth.controller";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type Props = {
  event: Event;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
};

export const EventCard = ({
  event,
  isFavorited = false,
  onToggleFavorite,
}: Props) => {
  const dt = dayjs(event.dateTime).format("DD.MM.YYYY HH:mm");
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const handleFavClick = () => {
    if (!accessToken) {
      navigate(ROUTES.LOGIN);
      return;
    }
    onToggleFavorite?.();
  };
  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      {event.imageUrl && (
        <CardMedia
          component="img"
          height="160"
          image={event.imageUrl}
          alt={event.title}
        />
      )}

      {event.rating && (
        <Box
          mt={1}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
          gap={0.5}
        >
          <Rating
            value={event.rating.avg}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {event.rating.avg.toFixed(1)} ({event.rating.count})
          </Typography>
        </Box>
      )}

      {onToggleFavorite && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleFavClick();
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "background.paper",
          }}
          aria-label={
            isFavorited ? "Ukloni iz omiljenih" : "Sačuvaj u omiljene"
          }
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ textDecoration: "none" }}>
          {event.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {dt}
        </Typography>

        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          <Chip size="small" label={EventTypeLabels[event.type]} />
          <Chip
            size="small"
            variant="outlined"
            label={`Kapacitet: ${event.capacity}`}
          />
          {event.institution?.name && (
            <Chip
              size="small"
              variant="outlined"
              label={event.institution.name}
            />
          )}
          {typeof event._count?.favorites === "number" && (
            <Tooltip title="Broj omiljenih">
              <Chip size="small" label={`${event._count.favorites} ❤️`} />
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {event.description}
        </Typography>
      </Box>
    </Card>
  );
};
