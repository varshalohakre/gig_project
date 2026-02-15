import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Rating,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css"; // Make sure to create a corresponding CSS file
import Header from "../../components/Header/Header";
import { Link as ScrollLink, Element, scroller } from "react-scroll";
import Login from "../login/login";

const Homepage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const whoAreWeRef = useRef(null);
  const talentQueue = useRef(null);
  const location = useLocation();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;
  const getTopUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiurl}/user/top-talent-artists`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTopUsers();
  }, []);

  useEffect(() => {
    // Check if the URL contains a hash and scroll to the appropriate section
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the '#' character
      scroller.scrollTo(hash, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (whoAreWeRef.current) {
        const rect = whoAreWeRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible) {
          whoAreWeRef.current.classList.add("fade-in");
        }
      }
      if (talentQueue.current) {
        const rect = talentQueue.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible) {
          talentQueue.current.classList.add("fade-in");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Header showModal={showModal} setShowModal={setShowModal} />

      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      {/* Hero Section */}
      <Box
        className="hero-section"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
        }}
      >
        <img
          src="https://static.wixstatic.com/media/9eba43_e946a48f2d144235970267576abce0a0~mv2.jpg/v1/fill/w_454,h_430,al_c,lg_1,q_80,enc_auto/woman%20guitar%20gig.jpg"
          alt="Talent"
          className="hero-image"
        />
        <Box className="hero-text">
          <Typography
            style={{ color: "black", textAlign: "right", fontWeight: "750" }}
            variant="h3"
            component="h1"
            gutterBottom
          >
            have a talent?
          </Typography>
          <Typography
            style={{
              color: "rgb(153, 153, 151)",
              textAlign: "right",
              fontWeight: "750",
              fontFamily: "Arial,Helvetica,sans-serif",
            }}
            variant="h4"
            component="h2"
            gutterBottom
          >
            we have an opportunity
          </Typography>
          <Typography
            style={{
              color: "rgb(153, 153, 151)",
              textAlign: "right",
              fontWeight: "500",
            }}
            variant="body1"
            paragraph
          >
            unleash your hidden talents with{" "}
            <strong style={{ color: "black" }}>gig</strong>, where everyday
            enthusiasts shine outside the office.
          </Typography>
          <Typography
            style={{
              color: "rgb(153, 153, 151)",
              textAlign: "right",
              fontWeight: "500",
            }}
            variant="body1"
            paragraph
          >
            whether you're a weekend sketch artist, a guitar-strumming
            accountant, or a comedy-loving teacher, gig empowers you to turn
            your passions into rewarding side gigs.
          </Typography>
          {/* <Box component="form" noValidate autoComplete="off">
            <TextField
              label="your email, please? no spam, just early access to gig."
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
            />
            <button className="signup-btn" variant="contained" color="primary">
              join the talent queue
            </button>
          </Box> */}
        </Box>
      </Box>

      <Element
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        name="whoAreWe"
      >
        <Box
          className="who-are-we-section"
          ref={whoAreWeRef}
          sx={{ padding: "2rem", textAlign: "center", width: "50%" }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            who are we?
          </Typography>
          <Typography variant="body1" className="fade-in-text">
            we are a couple of people who believe that every person has a hidden
            talent and for every talent, there is an opportunity - except
            there's no such platform which takes advantage of it yet.
            <br />
            <br />
            so, we created gig, to give people the opportunity to pursue what
            they love while continuing to work at their 9 to 5 jobs - and hey,
            if you start earning enough to leave your day job, you're welcome!
          </Typography>
        </Box>
      </Element>

      {/* <Element
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        name="talentQueue"
      >
        <Box
          className="who-are-we-section"
          ref={talentQueue}
          sx={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#fff",
            width: "50%",
          }}
        >
          {/* <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            what is the talent queue?
          </Typography> */}
      {/* <Typography variant="body1" paragraph className="fade-in-text">
            we don't have the infrastructure for everyone to join gig, but if we
            get interest from you, you'll be first in line. here are some
            benefits of being in the talent queue:
          </Typography>
          <Typography variant="body1" component="div" className="fade-in-text">
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                - <strong>first access</strong> to anything gig (the app)
              </li>
              <li>
                - <strong>exclusive</strong> invite for your friends
              </li>
              <li>
                - <strong>ad free access</strong> for lifetime
              </li>
            </ul>
          </Typography>
        </Box>
      </Element> */}

      {/* Talent Artists Section */}
      <Element
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
        name="talentQueue"
      >
        <Box
          className=""
          ref={talentQueue}
          sx={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h4" component="h2" gutterBottom>
                Talent Artists
              </Typography>
              <Grid container spacing={4}>
                {users?.map((user) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                    <Box
                      sx={{
                        // width: "100%", // Ensures the Box uses all available space within the Grid item
                        // // maxWidth: "100%", // Sets a maximum width for the card
                        height: "100%",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        padding: 2,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => navigate(`user/${user._id}`)}
                        href={`user/${user._id}`}
                        style={{
                          textDecoration: "none",
                          border: "none",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          style={{
                            width: "100%",
                            height: "auto",
                            // borderRadius: "50%",
                          }}
                        />
                      </button>
                      <Typography variant="h6" sx={{ marginTop: "0" }}>
                        {user.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 0,
                        }}
                      >
                        <Rating
                          sx={{ fontSize: "0.7rem" }}
                          value={user.avgRating}
                          precision={0.1}
                          size="10px"
                          readOnly
                        />
                        <Typography
                          variant="body2"
                          sx={{ marginLeft: 1, fontSize: "0.7rem" }}
                        >
                          {user.avgRating} out of 5
                        </Typography>
                      </Box>
                      <Box sx={{ marginTop: 0 }}>
                        {user.category?.map((cat, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              display: "inline-block",
                              padding: "2px 8px",
                              margin: "2px",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "4px",
                            }}
                          >
                            {cat}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box textAlign="center" marginTop="3rem">
                <Button
                  sx={{ background: "black", color: "white", width: "25%" }}
                  variant="outlined"
                  onClick={() => navigate("/talent-artists")}
                  className="signup-btn"
                >
                  Browse More
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Element>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "black",
          color: "white",
          padding: "2rem",
          textAlign: "center",
          marginTop: "2rem",
          position: "inherit",
        }}
      >
        <Typography variant="body2">
          © 2024 The Gig. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Homepage;
