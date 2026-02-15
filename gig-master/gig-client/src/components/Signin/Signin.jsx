import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  googleloginAsync,
  loginAsync,
  selectAuthError,
  selectIsLoggedIn,
  selectUserId,
} from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { IconButton, TextField, Alert } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

function SignInForm() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const error = useSelector(selectAuthError);
  const userId = useSelector(selectUserId);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect to the home page after successful login
      navigate("/");
    }

    // return () => dispatch(clearError)
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setTimeout(() => dispatch(clearError()), 1000);
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // Adjust password complexity requirements as needed (e.g., minimum length, character types)
    return (
      password.length >= 8 && /[a-z]/i.test(password) && /[0-9]/.test(password)
    );
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    let isValid = true;
    setLoginError(""); // Clear previous errors

    // Email validation with inline feedback
    if (!validateEmail(state.email)) {
      setLoginError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation with inline feedback and icon
    if (!validatePassword(state.password)) {
      setLoginError(
        "Password must be at least 8 characters long and contain a mix of letters and numbers."
      );
      isValid = false;
    }
    if (isValid) {
      try {
        await dispatch(loginAsync(state));
        // Clear input fields after dispatching
        setState({
          email: "",
          password: "",
        });
        setLoginError("");
        // dispatch(clearError()); // Reset login error
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("Enter valid email id or password");
      }
    }
  };
  console.log(error);
  return (
    <div className="form-container sign-in-container">
      <div className="sign-in-form">
        <div className="social-container">
          <GoogleLogin
            clientId="<--client id-->"
            render={(renderProps) => (
              <button
                className="btn g-signin"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <p>Continue with Google</p>
              </button>
            )}
            buttonText="Login"
            onSuccess={(res) => dispatch(googleloginAsync(res))}
            onFailure={(res) => dispatch(googleloginAsync(res))}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <span className="spn">or use your account</span>
        <TextField
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          variant="outlined"
          className="input-labels"
          fullWidth
          required
          margin="normal"
        />

        <div style={{ position: "relative", width: "100%" }}>
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Password"
            variant="outlined"
            className="input-labels"
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowPassword}
                  style={{ position: "absolute", right: "10px", top: "10px" }}
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              ),
            }}
          />
        </div>

        {error && <Alert severity="error">{error}</Alert>}
        {loginError && <Alert severity="error">{loginError}</Alert>}

        <button onClick={handleOnSubmit} className="btn">
          Sign In
        </button>

        {isLoggedIn && (
          <Alert severity="success">Logged in successfully!</Alert>
        )}
      </div>
    </div>
  );
}

export default SignInForm;
