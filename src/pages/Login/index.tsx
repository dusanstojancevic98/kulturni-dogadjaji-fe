import { Box, Container } from "@mui/material";
import { LoginForm } from "@src/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
