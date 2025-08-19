import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { EventCard } from "@src/components/Events/EventCard";
import { ROUTES } from "@src/constants/routes";
import type { Event } from "@src/models/event.types";
import { getMyEvents } from "@src/services/events.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const MyEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4">Moji događaji</Typography>
        <Button component={Link} to={ROUTES.EVENT_CREATE} variant="contained">
          + Kreiraj događaj
        </Button>
      </Box>

      {loading ? (
        <Typography>Učitavanje...</Typography>
      ) : events.length === 0 ? (
        <Typography>Nemaš još kreiranih događaja.</Typography>
      ) : (
        <Grid container spacing={2}>
          {events.map((ev) => (
            <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <EventCard event={ev} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
