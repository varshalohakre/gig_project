import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import Header from "../../components/Header/Header";
import Login from "../login/login";
import { useSelector } from "react-redux";
import { selectAuthRoles } from "../../features/authSlice";
import Swal from "sweetalert2"; // Import SweetAlert2

const Loader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const Bookings = () => {
  const { userId } = useParams();
  const roles = useSelector(selectAuthRoles);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookingRequests = async () => {
      setLoading(true); // Start loading
      try {
        const response = roles.includes("talent_artist")
          ? await fetch(`${apiurl}/user/artist/booking-requests/${userId}`)
          : await fetch(`${apiurl}/user/seeker/bookings/${userId}`);
        const data = await response.json();
        setBookingRequests(data);
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBookingRequests();
  }, [userId, roles, apiurl]);

  const handleApprove = async (bookingId) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${apiurl}/user/bookings/${bookingId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "The booking request has been approved.",
        });
        setBookingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.bookingId === bookingId
              ? { ...request, status: "approved" }
              : request
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error approving the booking request.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error approving the booking request.",
      });
      console.error("Error approving booking request:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleReject = async (bookingId) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${apiurl}/user/bookings/${bookingId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "The booking request has been rejected.",
        });
        setBookingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.bookingId === bookingId
              ? { ...request, status: "rejected" }
              : request
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error rejecting the booking request.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error rejecting the booking request.",
      });
      console.error("Error rejecting booking request:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />
      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {roles?.includes("talent_artist") ? (
          <Box sx={{ padding: 2, width: "80%" }}>
            <Grid container spacing={3}>
              {bookingRequests?.length ? (
                bookingRequests?.map((request) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={request?.bookingId}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">
                          {request?.talentSeeker?.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          gutterBottom
                        >
                          {request?.talentSeeker?.email}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          gutterBottom
                        >
                          {request?.talentSeeker?.mobileNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Appointment Time:{" "}
                          {format(
                            new Date(request?.appointmentTime),
                            "dd MMM yyyy HH:mm"
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Message: {request?.message}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {request?.status === "pending" ? (
                          <>
                            <Button
                              onClick={() => handleApprove(request?.bookingId)}
                              variant="contained"
                              color="primary"
                              fullWidth
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(request?.bookingId)}
                              variant="outlined"
                              color="error"
                              fullWidth
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ marginTop: 1 }}
                          >
                            Your Appointment is {request?.status}
                          </Typography>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "45%",
                  }}
                >
                  No Booking Requests
                </div>
              )}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ padding: 2, width: "80%" }}>
            <Grid container spacing={3}>
              {bookingRequests?.length ? (
                bookingRequests?.map((request) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={request.bookingId}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">
                          {request?.talentArtist?.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          gutterBottom
                        >
                          {request?.talentArtist?.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Appointment Time:{" "}
                          {format(
                            new Date(request?.appointmentTime),
                            "dd MMM yyyy HH:mm"
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Message: {request?.message}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Status: {request?.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "45%",
                  }}
                >
                  No Booking Requests
                </div>
              )}
            </Grid>
          </Box>
        )}
      </div>
    </>
  );
};

export default Bookings;
