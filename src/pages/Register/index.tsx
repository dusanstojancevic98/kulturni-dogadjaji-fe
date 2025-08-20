import { Box, Container } from "@mui/material";
import { RegisterForm } from "@src/components/auth/RegisterForm";

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
