import {
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ROUTES } from "@src/constants/routes";
import { EventType, EventTypeLabels } from "@src/models/event.types";
import type { InstitutionOption } from "@src/models/institution.types";
import { getEventById } from "@src/services/events.api";
import { getInstitutionsSelect } from "@src/services/institutions.api";
import { eventsController } from "@src/store/events/event.controller";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type EditEventInput = {
  title: string;
  description: string;
  dateTime: string;
  type: EventType;
  capacity: number;
  imageUrl: string;
  institutionId: string;
};

export const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditEventInput>();

  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);

  useEffect(() => {
    (async () => {
      const [ev, inst] = await Promise.all([
        getEventById(id!),
        getInstitutionsSelect(),
      ]);
      setInstitutions(inst);
      reset({
        title: ev.title,
        description: ev.description,
        dateTime: ev.dateTime,
        type: ev.type as EventType,
        capacity: ev.capacity,
        imageUrl: ev.imageUrl,
        institutionId: ev.institutionId,
      });

      if (!ev.institutionId && inst.length > 0) {
        setValue("institutionId", inst[0].id);
      }
    })();
  }, [id, reset, setValue]);

  const onSubmit = async (data: EditEventInput) => {
    eventsController.update(id!, {
      ...data,
      dateTime: dayjs(data.dateTime).toISOString(),
    });
    navigate(ROUTES.EVENT_DETAIL(id));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Izmena događaja
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
                <DateTimePicker
                  label="Datum i vreme"
                  value={dayjs(field.value)}
                  onChange={(val) =>
                    field.onChange(val ? val.toISOString() : "")
                  }
                  format="DD.MM.YYYY HH:mm"
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              rules={{ required: "Obavezno" }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  label="Tip događaja"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {Object.values(EventType).map((t) => (
                    <MenuItem key={t} value={t}>
                      {EventTypeLabels[t]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

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

            <Controller
              name="institutionId"
              control={control}
              rules={{ required: "Obavezno" }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  label="Institucija"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {institutions.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.EVENT_DETAIL(id))}
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
