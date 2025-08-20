import { Container, Stack, Typography } from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import { EventCard } from "@src/components/events/EventCard";
import type { Event } from "@src/models/event.types";
import { getMyFavorites, toggleFavorite } from "@src/services/favorites.api";
import { useEffect, useState } from "react";

export const MyFavoritesPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const snack = useSnack();

  useEffect(() => {
    (async () => {
      const data = await getMyFavorites();
      setEvents(data);
    })();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await toggleFavorite(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      snack.info("Uklonjeno iz omiljenih");
    } catch {
      snack.error("Greška pri uklanjanju");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Moji omiljeni događaji
      </Typography>
      {events.length === 0 ? (
        <Typography>Nemaš rezervisane događaje.</Typography>
      ) : (
        <Stack spacing={2}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorited={true}
              onToggleFavorite={() => handleRemove(event.id)}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};
