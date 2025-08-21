/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InstitutionCard } from "@src/components/institutions/InstitutionCard";
import { ROUTES } from "@src/constants/routes";
import type {
  Institution,
  InstitutionFilters,
  InstitutionType,
} from "@src/models/institution.types";
import { InstitutionTypeLabels } from "@src/models/institution.types";
import { useAuth } from "@src/store/auth/auth.controller";
import { UserRole } from "@src/store/auth/auth.state";
import {
  institutionsController,
  useInstitutions,
} from "@src/store/institutions/institutions.controller";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZES = [6, 12, 24];

export const InstitutionListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, loading, filters, total } = useInstitutions();
  const { q, type, page, pageSize } = filters;

  const getFilters = () => {
    const searchFilters: InstitutionFilters = {};

    for (const k of [
      "q",
      "type",
      "pageSize",
      "page",
    ] as (keyof InstitutionFilters)[]) {
      const v = searchParams.get(k);
      if (v) (searchFilters as any)[k] = v;
    }
    return searchFilters;
  };

  useEffect(() => {
    institutionsController.loadList();
  }, [filters]);
  useEffect(() => {
    institutionsController.setFilters(getFilters());
  }, [searchParams]);

  const applyFilters = (f: Partial<InstitutionFilters>) => {
    const newFilters = { ...filters, ...f };
    console.log(filters, f, newFilters);
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    if (newFilters.q) {
      next.set("q", newFilters.q);
    } else {
      next.delete("q");
    }

    if (newFilters.type) {
      next.set("type", String(newFilters.type));
    } else {
      next.delete("type");
    }
    setSearchParams(next, { replace: true });
  };

  const onPageChange = (_: any, p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ pageSize: Number(e.target.value) });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ type: (e.target.value || undefined) as InstitutionType });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ q: e.target.value || undefined });
  };

  const { user } = useAuth();

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        spacing={2}
      >
        <Typography variant="h4">Institucije</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
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
          {user &&
            (user.role === UserRole.ADMIN ||
              user.role === UserRole.ORGANIZER) && (
              <Button
                component={Link}
                to={ROUTES.INSTITUTION_CREATE}
                variant="contained"
              >
                Nova institucija
              </Button>
            )}
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <TextField
          size="small"
          label="Pretraga"
          defaultValue={q}
          onChange={handleSearch}
        />
        <TextField
          select
          size="small"
          label="Tip"
          defaultValue={type}
          onChange={handleTypeChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem>Svi</MenuItem>
          {Object.entries(InstitutionTypeLabels).map(([val, label]) => (
            <MenuItem key={val} value={val}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={48} />
        </Box>
      ) : items.length === 0 ? (
        <Typography>Nema rezultata za zadate filtere.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((inst: Institution) => (
              <Grid key={inst.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <InstitutionCard institution={inst} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              page={page}
              count={Math.max(1, Math.ceil(total / (pageSize ?? 12)))}
              onChange={onPageChange}
            />
          </Box>
        </>
      )}
    </Container>
  );
};
