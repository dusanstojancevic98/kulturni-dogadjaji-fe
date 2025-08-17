import {
  Box,
  Button,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { EventCard } from "@src/components/Events/EventCard";
import { EventFiltersBar } from "@src/components/Events/EventFilter";
import { ROUTES } from "@src/constants/routes";
import type { Event, EventFilters, Paginated } from "@src/models/event.types";
import { getEvents } from "@src/services/events.api";
import { useAuth } from "@src/store/auth/auth.store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const EventsListPage = () => {
  const [data, setData] = useState<Paginated<Event>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
  });
  const [filters, setFilters] = useState<EventFilters>({});
  const { accessToken } = useAuth();

  const load = async (page = 1) => {
    const res = await getEvents(page, data.pageSize, filters);
    setData(res);
  };

  useEffect(() => {
    load(1);
  }, [JSON.stringify(filters)]);

  return (
    <Container sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4">Događaji</Typography>
        {accessToken && (
          <Button component={Link} to={ROUTES.EVENT_CREATE} variant="contained">
            Novi događaj
          </Button>
        )}
      </Box>

      <EventFiltersBar defaultValues={filters} onChange={setFilters} />

      <Grid container spacing={2}>
        {data.items.map((ev) => (
          <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <EventCard event={ev} />
          </Grid>
        ))}
      </Grid>

      {data.total > data.pageSize && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            page={data.page}
            count={Math.ceil(data.total / data.pageSize)}
            onChange={(_, p) => void load(p)}
          />
        </Box>
      )}
    </Container>
  );
};
