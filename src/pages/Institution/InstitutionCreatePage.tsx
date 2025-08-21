import { Container, Typography } from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import {
  InstitutionForm,
  type InstitutionFormValues,
} from "@src/components/institutions/InstitutionForm";
import { ROUTES } from "@src/constants/routes";
import { institutionsController } from "@src/store/institutions/institutions.controller";
import { useNavigate } from "react-router-dom";

export const InstitutionCreatePage = () => {
  const snack = useSnack();
  const navigate = useNavigate();

  const onSubmit = async (data: InstitutionFormValues) => {
    try {
      const created = await institutionsController.create(data);
      snack.success("Institucija kreirana");
      navigate(ROUTES.INSTITUTION_DETAIL(created.id));
    } catch {
      snack.error("Greška pri kreiranju");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Nova institucija
      </Typography>
      <InstitutionForm onSubmit={onSubmit} />
    </Container>
  );
};
