import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateFormat } from "@src/helper/date";
import type { EventFilters } from "@src/models/event.types";
import { EventType, EventTypeLabels } from "@src/models/event.types";
import type { Institution } from "@src/models/institution.types";
import { getInstitutions } from "@src/services/institutions.api";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { CustomDatePicker } from "../DatePicker";

type Props = {
  defaultValues?: EventFilters;
  onChange: (filters: EventFilters) => void;
};

const DEFAULT_INSTITUTION_ID = "Sve";

export const EventFiltersBar = ({ defaultValues, onChange }: Props) => {
  const [q, setQ] = useState(defaultValues?.q ?? "");
  const [type, setType] = useState<EventType | "">(defaultValues?.type ?? "");
  const [from, setFrom] = useState<Dayjs | null>(
    defaultValues?.from ? dayjs(defaultValues.from) : null
  );
  const [to, setTo] = useState<Dayjs | null>(
    defaultValues?.to ? dayjs(defaultValues.to) : null
  );
  const [institutionId, setInstitutionId] = useState(
    defaultValues?.institutionId ?? ""
  );
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    (async () => setInstitutions(await getInstitutions()))();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromIso = from ? from.startOf("day").toISOString() : undefined;
    const toIso = to ? to.endOf("day").toISOString() : undefined;

    onChange({
      q: q || undefined,
      type: (type as EventType) || undefined,
      from: fromIso,
      to: toIso,
      institutionId:
        institutionId === DEFAULT_INSTITUTION_ID ? undefined : institutionId,
    });
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mb: 2 }}>
      <Grid
        container
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Pretraga"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
        />

        <TextField
          select
          label="Tip"
          value={type}
          onChange={(e) => setType(e.target.value as EventType | "")}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Svi</MenuItem>
          {Object.values(EventType).map((t) => (
            <MenuItem key={t} value={t}>
              {EventTypeLabels[t]}
            </MenuItem>
          ))}
        </TextField>

        <CustomDatePicker
          label="Od"
          value={from}
          onChange={(val) => setFrom(val)}
          format={DateFormat.DATE}
          slotProps={{ textField: { size: "small" } }}
          pickerType="date"
        />

        <CustomDatePicker
          label="Do"
          value={to}
          onChange={(val) => setTo(val)}
          format={DateFormat.DATE}
          slotProps={{ textField: { size: "small" } }}
          pickerType="date"
        />

        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="inst-filter-label">Institucija</InputLabel>
          <Select
            labelId="inst-filter-label"
            label="Institucija"
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
          >
            <MenuItem value={DEFAULT_INSTITUTION_ID}>
              {DEFAULT_INSTITUTION_ID}
            </MenuItem>
            {institutions.map((inst) => (
              <MenuItem key={inst.id} value={inst.id}>
                {inst.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Primeni
        </Button>
      </Grid>
    </Box>
  );
};
