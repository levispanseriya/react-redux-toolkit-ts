import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = () => {
    onSubmit(email);
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleForgotPassword}
      >
        Send Email
      </Button>
    </Container>
  );
};

export default ForgotPassword;
