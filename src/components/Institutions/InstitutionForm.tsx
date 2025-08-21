import { Button, MenuItem, Paper, Stack, TextField } from "@mui/material";
import type { InstitutionType } from "@src/models/institution.types";
import { InstitutionTypeLabels } from "@src/models/institution.types";
import { useForm } from "react-hook-form";
import { AddressPicker } from "../map/AddressPicker";

export type InstitutionFormValues = {
  name: string;
  description: string;
  type: InstitutionType;
  address: string;
  contactEmail: string;
  imageUrl: string;
  latitude?: number | null;
  longitude?: number | null;
};

type Props = {
  defaultValues?: Partial<InstitutionFormValues>;
  onSubmit: (data: InstitutionFormValues) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
};

export const InstitutionForm = ({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel = "Sačuvaj",
}: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InstitutionFormValues>({
    defaultValues: {
      name: "",
      description: "",
      type: "MUSEUM",
      address: "",
      contactEmail: "",
      imageUrl: "",
      latitude: null,
      longitude: null,
      ...defaultValues,
    },
  });

  const address = watch("address");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Naziv"
            {...register("name", {
              required: "Obavezno",
              minLength: { value: 2, message: "Min 2 karaktera" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Opis"
            multiline
            minRows={3}
            {...register("description", {
              required: "Obavezno",
              minLength: { value: 5, message: "Min 5 karaktera" },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            select
            label="Tip"
            defaultValue={defaultValues?.type ?? "MUSEUM"}
            {...register("type", { required: "Obavezno" })}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            {(Object.keys(InstitutionTypeLabels) as InstitutionType[]).map(
              (t) => (
                <MenuItem key={t} value={t}>
                  {InstitutionTypeLabels[t]}
                </MenuItem>
              )
            )}
          </TextField>
          <AddressPicker
            value={{
              address,
              latitude,
              longitude,
            }}
            onChange={(next) => {
              console.log(next);
              setValue("address", next.address);
              setValue("latitude", next.latitude);
              setValue("longitude", next.longitude);
            }}
          />
          <TextField
            label="Kontakt email"
            type="email"
            {...register("contactEmail", { required: "Obavezno" })}
            error={!!errors.contactEmail}
            helperText={errors.contactEmail?.message}
          />
          <TextField
            label="Slika (URL)"
            {...register("imageUrl", { required: "Obavezno" })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
            <Button variant="contained" type="submit" disabled={submitting}>
              {submitLabel}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};
