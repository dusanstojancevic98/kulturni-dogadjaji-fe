import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { EventCard } from "@src/components/events/EventCard";
import { ROUTES } from "@src/constants/routes";
import type { Event } from "@src/models/event.types";
import {
  cancelReservation,
  myReservations,
} from "@src/services/reservations.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const MyReservationsPage = () => {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const snack = useSnack();

  const load = async () => {
    setLoading(true);
    try {
      const res = await myReservations();
      const events = res.map((e) => e.event);
      setItems(events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCancel = async (id: string) => {
    try {
      await cancelReservation(id);
      setItems((prev) => prev.filter((e) => e.id !== id));
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

      {loading ? (
        <Typography>Učitavanje…</Typography>
      ) : items.length === 0 ? (
        <Typography>Nemaš aktivnih rezervacija.</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((ev) => (
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
                    onClick={() => void onCancel(ev.id)}
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
