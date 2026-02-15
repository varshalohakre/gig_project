import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  styled,
} from "@mui/material";
import Header from "../../components/Header/Header";
import Login from "../login/login";

const FormContainer = styled("div")({
  marginTop: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Form = styled("form")({
  width: "100%",
  maxWidth: 400,
  marginTop: "1rem",
  "& > *": {
    marginBottom: "1rem",
  },
});

const SubmitButton = styled(Button)({
  marginTop: "1rem",
});

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data : "An error occurred");
    }
  };

  return (
    <div>
      <Header showModal={showModal} setShowModal={setShowModal} />
      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      <Container>
        <FormContainer>
          <Typography variant="h4">Reset Password</Typography>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              style={{ marginBottom: "1rem" }}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              style={{ marginBottom: "1rem" }}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <button
              type="submit"
              className="signup-btn"
            >
              Reset Password
            </button>
            {/* <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Reset Password
            </SubmitButton> */}
          </Form>
          {message && <Typography>{message}</Typography>}
        </FormContainer>
      </Container>
    </div>
  );
};

export default ResetPassword;
