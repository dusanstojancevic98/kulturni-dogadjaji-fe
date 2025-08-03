import { Box, Container } from "@mui/material";
import { RegisterForm } from "@src/components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;
