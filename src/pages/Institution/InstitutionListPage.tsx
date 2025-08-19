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
import { InstitutionCard } from "@src/components/Institutions/InstitutionCard";
import { ROUTES } from "@src/constants/routes";
import type {
  Institution,
  InstitutionFilters,
  PaginatedInstitutions,
} from "@src/models/institution.types";
import {
  InstitutionTypeLabels,
  type InstitutionType,
} from "@src/models/institution.types";
import { getInstitutions } from "@src/services/institutions.api";
import { UserRole } from "@src/store/auth/auth.state";
import { useAuth } from "@src/store/auth/auth.store";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZES = [6, 12, 24];

export const InstitutionListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10)
  );
  const sizeFromUrl = parseInt(searchParams.get("pageSize") || "12", 10);

  const [data, setData] = useState<PaginatedInstitutions>({
    items: [],
    total: 0,
    page: pageFromUrl,
    pageSize: sizeFromUrl,
  });
  const [loading, setLoading] = useState(false);

  const filters: InstitutionFilters = useMemo(() => {
    const q = searchParams.get("q") || undefined;
    const type =
      (searchParams.get("type") as InstitutionType | null) || undefined;
    return { q, type };
  }, [searchParams]);

  const page = pageFromUrl;
  const pageSize = useMemo(
    () => (PAGE_SIZES.includes(sizeFromUrl) ? sizeFromUrl : 12),
    [sizeFromUrl]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await getInstitutions(page, pageSize, filters);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, pageSize, JSON.stringify(filters)]);

  const applyFilters = (f: InstitutionFilters) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    if (f.q) {
      next.set("q", f.q);
    } else {
      next.delete("q");
    }

    if (f.type) {
      next.set("type", f.type);
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
    const next = new URLSearchParams(searchParams);
    next.set("pageSize", e.target.value);
    next.set("page", "1");
    setSearchParams(next, { replace: true });
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
          defaultValue={filters.q ?? ""}
          onBlur={(e) =>
            applyFilters({ ...filters, q: e.target.value || undefined })
          }
        />
        <TextField
          select
          size="small"
          label="Tip"
          defaultValue={filters.type ?? ""}
          onChange={(e) =>
            applyFilters({
              ...filters,
              type: (e.target.value || undefined) as
                | InstitutionType
                | undefined,
            })
          }
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Svi</MenuItem>
          {Object.entries(InstitutionTypeLabels).map(([val, label]) => (
            <MenuItem key={val} value={val}>
              {label}
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
            {data.items.map((inst: Institution) => (
              <Grid key={inst.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <InstitutionCard institution={inst} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              page={data.page}
              count={Math.max(1, Math.ceil(data.total / data.pageSize))}
              onChange={onPageChange}
            />
          </Box>
        </>
      )}
    </Container>
  );
};
