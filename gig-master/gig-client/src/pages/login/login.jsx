import { useEffect, useState } from "react";
import SignInForm from "../../components/Signin/Signin";
import SignUpForm from "../../components/Signup/Signup";
import CloseIcon from "@mui/icons-material/Close";
import "./Styles.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../features/authSlice";

const Login = ({ showModal, setShowModal }) => {
  const [type, setType] = useState("signIn");
  const isloggin = useSelector(selectIsLoggedIn);
  useEffect(() => {
    if (isloggin) {
      setShowModal(false);
    }
  }, [isloggin, showModal]);
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container show " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="modal-container show">
      <div className={containerClass} id="container">
        <button className="close-btn" onClick={() => setShowModal(!showModal)}>
          <CloseIcon />
        </button>
        {/* <a href="/" target="_self" className=""></a> */}
        <SignUpForm />
        <SignInForm />

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back to gig!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost btn"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost btn"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
