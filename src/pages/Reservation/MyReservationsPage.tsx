import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { EventCard } from "@src/components/events/EventCard";
import { ROUTES } from "@src/constants/routes";
import type { Event } from "@src/models/event.types";
import {
  reservationsController,
  useReservations,
} from "@src/store/reservations/reservations.controller";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const MyReservationsPage = () => {
  const snack = useSnack();

  const { reservedEvents, loaded } = useReservations();

  useEffect(() => {
    reservationsController.loadMine();
  }, []);

  const onCancel = async (event: Event) => {
    try {
      reservationsController.cancel(event);
      snack.success("Rezervacija otkazana");
    } catch {
      snack.error("Greška pri otkazivanju");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Moje rezervacije</Typography>
        <Button component={Link} to={ROUTES.EVENTS} variant="outlined">
          Svi događaji
        </Button>
      </Stack>

      {!loaded ? (
        <Typography>Učitavanje…</Typography>
      ) : reservedEvents.length === 0 ? (
        <Typography>Nemaš aktivnih rezervacija.</Typography>
      ) : (
        <Grid container spacing={2}>
          {reservedEvents.map((ev) => (
            <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <EventCard event={ev} />
                <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={() => onCancel(ev)}
                  >
                    Otkaži rezervaciju
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
