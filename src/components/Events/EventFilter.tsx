import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { EventFilters } from "@src/models/event.types";
import { EventType, EventTypeLabels } from "@src/models/event.types";
import type { InstitutionOption } from "@src/models/institution.types";
import { getInstitutionsSelect } from "@src/services/institutions.api";
import { useEvents } from "@src/store/events/event.controller";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_INSTITUTION_ID = "Sve";
const SORT_OPTIONS = [
  { value: "date", label: "Datum" },
  { value: "title", label: "Naziv" },
  { value: "favorites", label: "Omiljeni" },
  { value: "reservations", label: "Rezervacije" },
];
const PAGE_SIZES = [6, 12, 24];

export const EventFiltersBar: React.FC = () => {
  const [institutions, setInstitutions] = React.useState<InstitutionOption[]>(
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useEvents();
  const {
    q,
    type,
    from: fromString,
    to: toString,
    institutionId,
    pageSize,
    order,
    sort,
  } = filters;

  const from = fromString ? dayjs(fromString) : null;
  const to = toString ? dayjs(toString) : null;

  useEffect(() => {
    (async () => {
      const list = await getInstitutionsSelect();
      setInstitutions(list);
    })();
  }, []);

  const applyFilters = useCallback(
    (f: Partial<EventFilters>) => {
      const newFilters = { ...filters, ...f };
      const next = new URLSearchParams(searchParams);
      next.delete("page");
      if (newFilters.q) next.set("q", newFilters.q);
      else next.delete("q");
      if (newFilters.type) next.set("type", String(newFilters.type));
      else next.delete("type");

      if (newFilters.from) next.set("from", newFilters.from);
      else next.delete("from");

      if (newFilters.to) next.set("to", newFilters.to);
      else next.delete("to");

      if (newFilters.institutionId)
        next.set("institutionId", newFilters.institutionId);
      else next.delete("institutionId");
      if (newFilters.order) next.set("order", newFilters.order);
      else next.delete("order");
      if (newFilters.sort) next.set("sort", newFilters.sort);
      else next.delete("sort");
      if (newFilters.pageSize)
        next.set("pageSize", String(newFilters.pageSize));
      else next.delete("pageSize");
      setSearchParams(next);
    },
    [searchParams, setSearchParams, filters]
  );

  const handleTypeChange = (val: EventFilters["type"]) => {
    applyFilters({ type: val });
  };

  const onInstitutionChange = (val?: string) => {
    applyFilters({ institutionId: val || undefined });
  };

  const handleFromChange = (val: Dayjs | null) => {
    applyFilters({ from: val ? val.toISOString() : undefined });
  };

  const handleToChange = (val: Dayjs | null) => {
    applyFilters({ to: val ? val.toISOString() : undefined });
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ order: e.target.value as "asc" | "desc" });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({
      sort: e.target.value as "date" | "title" | "favorites" | "reservations",
    });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ pageSize: Number(e.target.value) });
  };

  const clearAll = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={2}
        alignItems="stretch"
      >
        <TextField
          size="small"
          label="Pretraga"
          placeholder="Naziv ili opis…"
          value={q}
          onChange={(e) => applyFilters({ q: e.target.value })}
          sx={{ minWidth: 220 }}
        />

        <TextField
          select
          size="small"
          label="Tip događaja"
          value={type ?? ""}
          onChange={(e) =>
            handleTypeChange((e.target.value || undefined) as EventType)
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem>Svi</MenuItem>
          {Object.values(EventType).map((t) => (
            <MenuItem key={t} value={t}>
              {EventTypeLabels[t]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Institucija"
          value={institutionId ?? ""}
          onChange={(e) => onInstitutionChange(e.target.value || undefined)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem>{DEFAULT_INSTITUTION_ID}</MenuItem>
          {institutions.map((inst) => (
            <MenuItem key={inst.id} value={inst.id}>
              {inst.name}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Od datuma"
          value={from}
          onChange={handleFromChange}
          slotProps={{ textField: { size: "small" } }}
          key={"from-date-picker"}
        />
        <DatePicker
          label="Do datuma"
          value={to}
          onChange={handleToChange}
          slotProps={{ textField: { size: "small" } }}
          key={"to-date-picker"}
        />

        <Button variant="contained" color="warning" onClick={clearAll}>
          Poništi
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 2 }}>
        <TextField
          select
          size="small"
          label="Sortiraj"
          value={sort}
          onChange={handleSortChange}
          sx={{ width: 160 }}
          defaultValue={SORT_OPTIONS[0].value}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Redosled"
          value={order}
          onChange={handleOrderChange}
          sx={{ width: 140 }}
          defaultValue="asc"
        >
          <MenuItem value="asc">Rastuće</MenuItem>
          <MenuItem value="desc">Opadajuće</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Po strani"
          value={pageSize}
          onChange={handlePageSizeChange}
          sx={{ width: 120 }}
        >
          {PAGE_SIZES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </>
  );
};
