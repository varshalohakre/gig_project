import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./styles.css"; // Import the stylesheet
import { useDispatch, useSelector } from "react-redux";
import {
  logoutAsync,
  selectAuthRoles,
  selectIsLoggedIn,
  selectUserId,
} from "../../features/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Header = ({ showModal, setShowModal }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userid = useSelector(selectUserId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const roles = useSelector(selectAuthRoles);
  const location = useLocation();
  console.log(location.pathname);
  const goToWhoAreWe = () => {
    if (location.pathname !== "/") navigate("/#whoAreWe");
  };

  const goToTalentQueue = () => {
    // if(location.pathname !== '/')
    navigate("/talent-artists");
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logoutAsync());
      navigate("/"); // Dispatch the logout action
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle errors appropriately
    }
  };

  const togglePopup = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };
  return (
    <div className="header-main">
      <a href="/" target="_self" className="">
        <span className="gig-title">
          g<span className="underlined-i">i</span>g
        </span>
      </a>

      {/* Other elements on the right */}
      <div className="right-content">
        <ScrollLink to="whoAreWe" smooth={true} duration={500}>
          <div
            onClick={goToWhoAreWe}
            style={{ fontSize: "1rem", cursor: "pointer" }}
          >
            who are we?
          </div>
        </ScrollLink>
        <ScrollLink to="talentQueue" smooth={true} duration={500}>
          <div
            onClick={goToTalentQueue}
            style={{ fontSize: "1rem", cursor: "pointer" }}
          >
            talent artists
          </div>
        </ScrollLink>
        <div className="dark">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowModal(!showModal)}
              className="custom-btn btn-white"
            >
              User Login
            </button>
          ) : (
            <div className="sign-out-user-btn">
              <button
                className="useraccount"
                onClick={togglePopup}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <AccountCircleIcon />
              </button>
              {showPopup && (
                <div className="popup-menu">
                  <div
                    className="popup-item"
                    onClick={() => navigate(`/myaccount/${userid}`)}
                  >
                    Account Settings
                  </div>
                  {roles?.includes("talent_artist") ? (
                    <div
                      className="popup-item"
                      onClick={() => navigate(`/booking-requests/${userid}`)}
                    >
                      Booking Requests
                    </div>
                  ) : (
                    <div
                      className="popup-item"
                      onClick={() => navigate(`/booking-requests/${userid}`)}
                    >
                      My Bookings
                    </div>
                  )}
                </div>
              )}
              <button onClick={handleSignOut} className="custom-btn btn-white">
                Sign Out
              </button>
            </div>
          )}
        </div>
        {/* Add other elements here */}
      </div>
    </div>
  );
};

export default Header;
