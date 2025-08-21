import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { EventCard } from "@src/components/events/EventCard";
import { ROUTES } from "@src/constants/routes";
import {
  eventsController,
  useEvents,
} from "@src/store/events/event.controller";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const MyEventsPage = () => {
  const { items: events, loading } = useEvents();

  useEffect(() => {
    eventsController.loadMine();
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={48} />
        </Box>
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
