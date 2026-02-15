import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthMessage,
  registerAsync,
  clearMessages,
} from "../../features/authSlice";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from Material-UI

function SignUpForm() {
  const dispatch = useDispatch();
  const successmsg = useSelector(selectAuthMessage);
  const errormsg = useSelector((state) => state.auth.error);
  console.log(errormsg);
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    roles: ["talent_seeker"],
    category: [],
    description: "",
    portfolio: [""], // Initial portfolio state with one empty URL
  });

  const [selectedRole, setSelectedRole] = useState("talent_seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [signedup, setSignedup] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    setTimeout(() => setSignedup(false), 5000);
  }, [signedup]);

  useEffect(() => {
    if (successmsg) {
      toast.success(successmsg);
      setSignedup(true);
      dispatch(clearMessages());
    } else if (errormsg) {
      setSignedup(false);
      toast.error(errormsg);
      dispatch(clearMessages());
    }
    setLoading(false); // Stop loading after success or error
  }, [successmsg, errormsg, dispatch]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handlePortfolioChange = (value) => {
    setState({ ...state, portfolio: [value] });
  };

  const validateForm = () => {
    if (!state.name) return "Name is required.";
    if (!state.email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) return "Email format is invalid.";
    if (!state.mobileNumber) return "Mobile Number is required.";
    if (!state.password) {
      return "Password is required.";
    }
    if (state.roles.includes("talent_artist") && state.category.length === 0)
      return "Please select at least one category.";
    if (state.roles.includes("talent_artist") && !state.description)
      return "Description is required.";
    const urlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (state.roles.includes("talent_artist")) {
      if (!urlRegex.test(state.portfolio[0]))
        return "Please provide a valid YouTube URL.";
    }
    
     const bool = state.password.length >= 8 && /[a-z]/i.test(state.password.length) && /[0-9]/.test(state.password.length);
    if(!bool){
      return "Password must be 8 characters long."
    }
    return null;
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const error = validateForm();
    if (error) {
      setValidationError(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    setLoading(true); // Set loading to true when the form is submitted
    dispatch(registerAsync(state));
    setState({
      name: "",
      email: "",
      password: "",
      mobileNumber: "",
      roles: ["talent_seeker"],
      category: [],
      description: "",
      portfolio: [""], // Reset portfolio to initial state
    });
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setState((prevState) => {
      let updatedRoles = ["talent_seeker"];
      if (role === "talent_artist") {
        updatedRoles.push("talent_artist");
      }
      return { ...prevState, roles: updatedRoles };
    });
  };

  const handleCategoryChange = (category) => {
    setState((prevState) => {
      const newCategories = prevState.category.includes(category)
        ? prevState.category.filter((item) => item !== category)
        : [...prevState.category, category];
      return { ...prevState, category: newCategories };
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const categories = ["Musician", "Magician", "Singer", "Dancer"];

  return (
    <div className="form-container sign-up-container">
      {!signedup && !showError && !errormsg ? (
        <div className="sign-in-form">
          <div className="spn2">Are you a</div>
          <div className="btn-div">
            <button
              className={`btn-role ${
                selectedRole === "talent_seeker" ? "selected" : ""
              }`}
              onClick={() => handleRoleSelection("talent_seeker")}
            >
              Talent Seeker
            </button>
            or
            <button
              className={`btn-role ${
                selectedRole === "talent_artist" ? "selected" : ""
              }`}
              onClick={() => handleRoleSelection("talent_artist")}
            >
              Talent Artist
            </button>
          </div>
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
            className="input-labels"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-labels"
          />
          <input
            type="text"
            name="mobileNumber"
            value={state.mobileNumber}
            onChange={handleChange}
            className="input-labels"
            placeholder="Mobile Number"
          />
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={state.password}
              onChange={handleChange}
              className="input-labels"
              placeholder="Password"
              style={{ paddingRight: "40px", width: "100%" }}
            />
            <IconButton
              onClick={handleClickShowPassword}
              style={{ position: "absolute", right: "10px", top: "10px" }}
            >
              {showPassword ? (
                <VisibilityOff fontSize="1.2rem" />
              ) : (
                <Visibility fontSize="1.2rem" />
              )}
            </IconButton>
          </div>
          {state.roles.includes("talent_artist") && (
            <div className="main-category-div">
              <div className="category-title">Choose your talent category</div>
              <div className="categories">
                {categories.map((category) => (
                  <div key={category}>
                    <input
                      type="checkbox"
                      id={category}
                      name="category"
                      value={category}
                      checked={state.category.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={category}>{category}</label>
                  </div>
                ))}
              </div>
              <textarea
                name="description"
                value={state.description}
                onChange={handleChange}
                placeholder="Tell us more about yourself"
                className="no-resize-textarea input-labels"
              ></textarea>
              <div className="portfolio-section">
                <div className="category-title">
                  Add your portfolio (YouTube URL)
                </div>
                <input
                  type="text"
                  value={state.portfolio[0]}
                  onChange={(e) => handlePortfolioChange(e.target.value)}
                  placeholder="YouTube URL"
                  className="input-labels"
                />
              </div>
            </div>
          )}

          <button
            className="signup-btn"
            onClick={handleOnSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </button>
        </div>
      ) : showError ? (
        <div className="error-message">{validationError}</div>
      ) : errormsg ? (
        <div className="error-message">
          {"Error Registring the User Email Alerady Exists! Please Try Again!"}
        </div>
      ) : (
        <div>User signed up successfully! Please log in to continue.</div>
      )}
    </div>
  );
}

export default SignUpForm;
