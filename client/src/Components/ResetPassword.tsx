import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

interface ResetPasswordProps {
  onSubmit: (password: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState<string>("");

  const handlereserpassword = () => {
    onSubmit(password);
  };

  return (
    <Container>
      <Typography variant="h4">Reset Password</Typography>
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handlereserpassword}>
        Reset Password
      </Button>
    </Container>
  );
};

export default ResetPassword;
