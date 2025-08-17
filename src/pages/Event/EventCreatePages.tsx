import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CustomDatePicker } from "@src/components/DatePicker";
import { ROUTES } from "@src/constants/routes";
import { DateFormat } from "@src/helper/date";
import { EventType, EventTypeLabels } from "@src/models/event.types";
import type { InstitutionOption } from "@src/models/institution.types";
import { createEvent } from "@src/services/events.api";
import { getInstitutionsSelect } from "@src/services/institutions.api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type CreateEventInput = {
  title: string;
  description: string;
  dateTime: string;
  type: EventType;
  capacity: number;
  imageUrl: string;
  institutionId: string;
};

export const EventCreatePage = () => {
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    defaultValues: {
      type: EventType.CONCERT,
      capacity: 100,
      dateTime: dayjs().toISOString(),
      institutionId: "",
    },
  });

  useEffect(() => {
    (async () => {
      const list = await getInstitutionsSelect();
      setInstitutions(list);
      if (list.length > 0) setValue("institutionId", list[0].id);
    })();
  }, [setValue]);

  const onSubmit = async (data: CreateEventInput) => {
    const iso = dayjs(data.dateTime).toISOString();
    await createEvent({ ...data, dateTime: iso });
    navigate(ROUTES.EVENTS);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Novi događaj
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Naslov"
              {...register("title", { required: "Obavezno" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Opis"
              {...register("description", { required: "Obavezno" })}
              error={!!errors.description}
              helperText={errors.description?.message}
              multiline
              minRows={3}
            />

            <Controller
              name="dateTime"
              control={control}
              rules={{ required: "Obavezno" }}
              render={({ field, fieldState }) => (
                <CustomDatePicker
                  label="Datum i vreme"
                  value={dayjs(field.value)}
                  onChange={(val) =>
                    field.onChange(val ? val.toISOString() : "")
                  }
                  format={DateFormat.DEFAULT}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />

            <TextField
              select
              label="Tip događaja"
              {...register("type", { required: "Obavezno" })}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              {Object.values(EventType).map((t) => (
                <MenuItem key={t} value={t}>
                  {EventTypeLabels[t]}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Kapacitet"
              type="number"
              inputProps={{ min: 1 }}
              {...register("capacity", {
                required: "Obavezno",
                min: 1,
                valueAsNumber: true,
              })}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
            />

            <TextField
              label="Slika (URL)"
              {...register("imageUrl", { required: "Obavezno" })}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
            />

            <FormControl error={!!errors.institutionId}>
              <InputLabel id="inst-label">Institucija</InputLabel>
              <Select
                labelId="inst-label"
                label="Institucija"
                defaultValue=""
                {...register("institutionId", { required: "Obavezno" })}
              >
                {institutions.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>
                    {inst.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.institutionId && (
                <Typography variant="caption" color="error">
                  {errors.institutionId.message}
                </Typography>
              )}
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.EVENTS)}
              >
                Otkaži
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Sačuvaj
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
