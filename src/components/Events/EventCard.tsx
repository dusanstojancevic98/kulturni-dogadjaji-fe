import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { getDate } from "@src/helper/date";
import { EventTypeLabels, type Event } from "@src/models/event.types";
import { useNavigate } from "react-router-dom";

export const EventCard = ({ event }: { event: Event }) => {
  const dt = getDate(event.dateTime);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
