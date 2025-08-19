import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { EventFilters } from "@src/models/event.types";
import { EventType, EventTypeLabels } from "@src/models/event.types";
import type { InstitutionOption } from "@src/models/institution.types";
import { getInstitutionsSelect } from "@src/services/institutions.api";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { useEffect } from "react";

type Props = {
  defaultValues?: EventFilters;
  onChange: (filters: EventFilters) => void;
};

const DEFAULT_INSTITUTION_ID = "Sve";
export const EventFiltersBar: React.FC<Props> = ({
  defaultValues,
  onChange,
}) => {
  const [q, setQ] = React.useState<string>(defaultValues?.q ?? "");
  const [type, setType] = React.useState<EventFilters["type"]>(
    defaultValues?.type
  );
  const [institutionId, setInstitutionId] = React.useState<string | undefined>(
    defaultValues?.institutionId
  );
  const [from, setFrom] = React.useState<Dayjs | null>(
    defaultValues?.from ? dayjs(defaultValues.from) : null
  );
  const [to, setTo] = React.useState<Dayjs | null>(
    defaultValues?.to ? dayjs(defaultValues.to) : null
  );

  const [institutions, setInstitutions] = React.useState<InstitutionOption[]>(
    []
  );

  React.useEffect(() => {
    (async () => {
      const list = await getInstitutionsSelect();
      setInstitutions(list);
    })();
  }, []);

  const emit = React.useCallback(
    (next?: Partial<EventFilters>) => {
      const filters: EventFilters = {
        q,
        type,
        institutionId:
          institutionId === DEFAULT_INSTITUTION_ID ? undefined : institutionId,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
        ...next,
      };
      onChange(filters);
    },
    [q, type, institutionId, from, to, onChange]
  );

  useEffect(() => {
    const t = setTimeout(() => emit(), 350);
    return () => clearTimeout(t);
  }, [q, emit]);

  const onTypeChange = (val: EventFilters["type"]) => {
    setType(val);
    emit({ type: val });
  };

  const onInstitutionChange = (val?: string) => {
    setInstitutionId(val || undefined);
    emit({ institutionId: val || undefined });
  };

  const onFromChange = (val: Dayjs | null) => {
    setFrom(val);
    emit({ from: val ? val.toISOString() : undefined });
  };

  const onToChange = (val: Dayjs | null) => {
    setTo(val);
    emit({ to: val ? val.toISOString() : undefined });
  };

  const clearAll = () => {
    setQ("");
    setType(undefined);
    setInstitutionId(undefined);
    setFrom(null);
    setTo(null);
    onChange({});
  };

  return (
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
        onChange={(e) => setQ(e.target.value)}
        sx={{ minWidth: 220 }}
      />

      <TextField
        select
        size="small"
        label="Tip događaja"
        value={type ?? ""}
        onChange={(e) =>
          onTypeChange((e.target.value || undefined) as EventFilters["type"])
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Svi</MenuItem>
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
        <MenuItem value={DEFAULT_INSTITUTION_ID}>
          {DEFAULT_INSTITUTION_ID}
        </MenuItem>
        {institutions.map((inst) => (
          <MenuItem key={inst.id} value={inst.id}>
            {inst.name}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Od datuma"
        value={from}
        onChange={onFromChange}
        slotProps={{ textField: { size: "small" } }}
      />
      <DatePicker
        label="Do datuma"
        value={to}
        onChange={onToChange}
        slotProps={{ textField: { size: "small" } }}
      />

      <Button variant="contained" color="warning" onClick={clearAll}>
        Poništi
      </Button>
    </Stack>
  );
};
