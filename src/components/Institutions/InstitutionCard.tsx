import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { ROUTES } from "@src/constants/routes";
import type { Institution } from "@src/models/institution.types";
import { InstitutionTypeLabels } from "@src/models/institution.types";
import { Link } from "react-router-dom";

type Props = { institution: Institution };

export const InstitutionCard = ({ institution }: Props) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {institution.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={institution.imageUrl}
          alt={institution.name}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          component={Link}
          to={ROUTES.INSTITUTION_DETAIL(institution.id)}
          variant="h6"
          sx={{ textDecoration: "none", display: "block", mb: 0.5 }}
        >
          {institution.name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip size="small" label={InstitutionTypeLabels[institution.type]} />
          {typeof institution._count?.events === "number" && (
            <Chip
              size="small"
              variant="outlined"
              label={`Događaji: ${institution._count.events}`}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {institution.address}
        </Typography>
      </CardContent>
    </Card>
  );
};
