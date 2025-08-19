import { Container, Typography } from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import {
  InstitutionForm,
  type InstitutionFormValues,
} from "@src/components/Institutions/InstitutionForm";
import { ROUTES } from "@src/constants/routes";
import type { Institution } from "@src/models/institution.types";
import {
  getInstitutionById,
  updateInstitution,
} from "@src/services/institutions.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const InstitutionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const snack = useSnack();
  const navigate = useNavigate();
  const [data, setData] = useState<Institution | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => setData(await getInstitutionById(id)))();
  }, [id]);

  const onSubmit = async (form: InstitutionFormValues) => {
    if (!id) return;
    try {
      const updated = await updateInstitution(id, form);
      snack.success("Institucija izmenjena");
      navigate(ROUTES.INSTITUTION_DETAIL(updated.id));
    } catch {
      snack.error("Greška pri izmeni");
    }
  };

  if (!data) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Učitavanje...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Izmena institucije
      </Typography>
      <InstitutionForm
        defaultValues={{
          name: data.name,
          description: data.description,
          type: data.type,
          address: data.address,
          contactEmail: data.contactEmail,
          imageUrl: data.imageUrl,
        }}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
