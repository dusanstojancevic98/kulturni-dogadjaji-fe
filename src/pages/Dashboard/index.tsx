import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4">Dobrodošao na Dashboard!</Typography>
      <Typography variant="body1">Ovo je zaštićena stranica.</Typography>
    </Box>
  );
}
