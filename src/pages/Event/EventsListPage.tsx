/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { EventCard } from "@src/components/events/EventCard";
import { EventFiltersBar } from "@src/components/events/EventFilter";
import { ROUTES } from "@src/constants/routes";
import type { EventFilters } from "@src/models/event.types";
import { useAuth } from "@src/store/auth/auth.controller";
import {
  eventsController,
  useEvents,
} from "@src/store/events/event.controller";
import {
  favoritesController,
  useFavorites,
} from "@src/store/favorites/favorite.controller";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export const EventsListPage = () => {
  const { accessToken } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, items, loading, total } = useEvents();
  const { page, pageSize } = filters;
  const totalPages = Math.max(1, Math.ceil(total / (pageSize ?? 12)));

  const { ids: favIds } = useFavorites();

  useEffect(() => {
    eventsController.setFilters(getFilters());
  }, [searchParams]);

  useEffect(() => {
    eventsController.loadList();
  }, [filters]);

  const getFilters = () => {
    const searchFilters: EventFilters = {};

    for (const k of [
      "q",
      "type",
      "from",
      "to",
      "institutionId",
      "sort",
      "order",
      "pageSize",
      "page",
    ] as (keyof EventFilters)[]) {
      const v = searchParams.get(k);
      if (v) (searchFilters as any)[k] = v;
    }
    return searchFilters;
  };

  useEffect(() => {
    if (!accessToken) {
      favoritesController.loadMine();
    }
  }, [accessToken]);

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFav = async (id: string) => {
    if (!accessToken) return;
    favoritesController.toggle(id);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        spacing={2}
      >
        <Typography variant="h4">Događaji</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {accessToken && (
            <Button
              component={Link}
              to={ROUTES.EVENT_CREATE}
              variant="contained"
            >
              Novi događaj
            </Button>
          )}
        </Stack>
      </Stack>

      <EventFiltersBar />

      {items.length === 0 ? (
        <Typography>Nema rezultata za zadate filtere.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard
                  event={event}
                  isFavorited={favIds.includes(event.id)}
                  onToggleFavorite={() => handleToggleFav(event.id)}
                />
              </Grid>
            ))}
          </Grid>

          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <CircularProgress size={48} />
            </Box>
          )}

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, page) => handlePageChange(page)}
            />
          </Box>
        </>
      )}
    </Container>
  );
};
