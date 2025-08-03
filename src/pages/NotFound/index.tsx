import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h5">Stranica koju tražiš ne postoji.</Typography>
    </Box>
  );
};

export default NotFoundPage;
