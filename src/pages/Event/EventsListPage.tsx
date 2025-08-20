/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EventCard } from "@src/components/events/EventCard";
import { EventFiltersBar } from "@src/components/events/EventFilter";
import { ROUTES } from "@src/constants/routes";
import type { Event, EventFilters } from "@src/models/event.types";
import type { Paginated } from "@src/services/api";
import { getEvents } from "@src/services/events.api";
import { getMyFavoriteIds, toggleFavorite } from "@src/services/favorites.api";
import { useAuth } from "@src/store/auth/auth.store";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "date", label: "Datum" },
  { value: "title", label: "Naziv" },
  { value: "favorites", label: "Omiljeni" },
  { value: "reservations", label: "Rezervacije" },
];
const PAGE_SIZES = [6, 12, 24];

export const EventsListPage = () => {
  const { accessToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10)
  );
  const sizeFromUrl = parseInt(searchParams.get("pageSize") || "12", 10);

  const [data, setData] = useState<Paginated<Event>>({
    items: [],
    total: 0,
    page: pageFromUrl,
    pageSize: sizeFromUrl,
  });
  const [loading, setLoading] = useState(false);
  const sortFromUrl =
    (searchParams.get("sort") as EventFilters["sort"]) || "date";
  const orderFromUrl = (searchParams.get("order") as "asc" | "desc") || "asc";

  const filters: EventFilters = useMemo(() => {
    const f: EventFilters = {};
    if (searchParams.get("sort")) f.sort = sortFromUrl;
    if (searchParams.get("order")) f.order = orderFromUrl;
    for (const k of ["q", "type", "from", "to", "institutionId"] as const) {
      const v = searchParams.get(k);
      if (v) (f as any)[k] = v;
    }
    return f;
  }, [searchParams]);

  const page = pageFromUrl;
  const pageSize = useMemo(
    () => (PAGE_SIZES.includes(sizeFromUrl) ? sizeFromUrl : 12),
    [sizeFromUrl]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEvents(page, pageSize, filters);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, pageSize, JSON.stringify(filters)]);

  const applyFilters = (f: EventFilters) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    if (f.q) next.set("q", f.q);
    else next.delete("q");
    if (f.type) next.set("type", String(f.type));
    else next.delete("type");
    if (f.from) next.set("from", f.from);
    else next.delete("from");
    if (f.to) next.set("to", f.to);
    else next.delete("to");
    if (f.institutionId) next.set("institutionId", f.institutionId);
    else next.delete("institutionId");
    setSearchParams(next, { replace: true });
  };

  const onPageChange = (_: any, p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = new URLSearchParams(searchParams);
    next.set("pageSize", e.target.value);
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!accessToken) {
      setFavIds(new Set());
      return;
    }
    (async () => {
      const ids = await getMyFavoriteIds();
      setFavIds(new Set(ids));
    })();
  }, [accessToken]);

  const handleToggleFav = async (id: string) => {
    if (!accessToken) return;
    const favorited = await toggleFavorite(id);
    setFavIds((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(id);
      else next.delete(id);
      return next;
    });
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

      <EventFiltersBar defaultValues={filters} onChange={applyFilters} />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 2 }}>
        <TextField
          select
          size="small"
          label="Sortiraj"
          value={sortFromUrl}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            next.set("sort", e.target.value);
            next.set("page", "1");
            setSearchParams(next, { replace: true });
          }}
          sx={{ width: 160 }}
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Redosled"
          value={orderFromUrl}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            next.set("order", e.target.value);
            next.set("page", "1");
            setSearchParams(next, { replace: true });
          }}
          sx={{ width: 140 }}
        >
          <MenuItem value="asc">Rastuće</MenuItem>
          <MenuItem value="desc">Opadajuće</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Po strani"
          value={pageSize}
          onChange={onPageSizeChange}
          sx={{ width: 120 }}
        >
          {PAGE_SIZES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {loading ? (
        <Typography>Učitavanje...</Typography>
      ) : data.items.length === 0 ? (
        <Typography>Nema rezultata za zadate filtere.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {data.items.map((ev) => (
              <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard
                  event={ev}
                  isFavorited={favIds.has(ev.id)}
                  onToggleFavorite={() => void handleToggleFav(ev.id)}
                />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={onPageChange}
            />
          </Box>
        </>
      )}
    </Container>
  );
};
