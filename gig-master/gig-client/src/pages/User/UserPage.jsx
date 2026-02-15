import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactPlayer from "react-player";
import Header from "../../components/Header/Header";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./userStyles.css";
import Login from "../login/login";
import { useSelector } from "react-redux";
import {
  selectAuthRoles,
  selectIsLoggedIn,
  selectUserId,
} from "../../features/authSlice";
import { formatDistanceToNow } from "date-fns";
import {
  TextField,
  Box,
  Typography,
  Grid,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CurrencyRupee from "@mui/icons-material/CurrencyRupee";

const UserPage = () => {
  const { id } = useParams();
  const userId = useSelector(selectUserId);
  const isloggedin = useSelector(selectIsLoggedIn);
  const roles = useSelector(selectAuthRoles);
  const [user, setUser] = useState();
  const [ratings, setRatings] = useState([]);
  const [distribution, setDistribution] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const apiurl = process.env.REACT_APP_API_URL;

  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "grey",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "black",
    },
  }));

  useEffect(() => {
    getUserDetails();
    getUserRatings();
    getRatingDistribution();
  }, []);

  const getUserRatings = async () => {
    try {
      const response = await fetch(`${apiurl}/user/ratings/${id}`);
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRatingDistribution = async () => {
    try {
      const response = await fetch(`${apiurl}/user/ratings-dist/${id}`);
      const data = await response.json();
      setDistribution(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${apiurl}/user/${id}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async () => {
    try {
      const requestBody = {
        ratings: [
          {
            user: userId,
            rating: userRating,
            comment: userComment,
          },
        ],
      };

      const response = await fetch(`${apiurl}/user/rating/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setUserRating(0);
      setUserComment("");
      getUserRatings();
      getRatingDistribution();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleBookNowClick = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerClose = async (confirm) => {
    if (confirm) {
      try {
        const response = await fetch(`${apiurl}/user/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            talentSeekerId: userId,
            talentArtistId: id,
            date: selectedDate,
            location: bookingLocation,
            message: bookingMessage,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to book artist");
        }

        // Handle successful booking (e.g., show a success message)
        setBookingConfirmed(true);
        setTimeout(() => setBookingConfirmed(false), 3000);
      } catch (error) {
        console.error("Error booking artist:", error);
      }
    }
    setShowDatePicker(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const calculateAverageRating = () => {
    const totalRatings = Object.values(distribution)?.reduce(
      (sum, count) => sum + count,
      0
    );
    const totalScore = Object.entries(distribution)?.reduce(
      (sum, [rating, count]) => sum + rating * count,
      0
    );
    return totalRatings ? (totalScore / totalRatings).toFixed(1) : 0;
  };

  const totalRatings = Object.values(distribution)?.reduce(
    (sum, count) => sum + count,
    0
  );
  const averageRating = calculateAverageRating();

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />
      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      <div className="main-div">
        <div className="main">
          <Carousel
            showIndicators={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={false}
            interval={5000}
            showStatus={false}
            swiping={true}
            className="carousel"
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="carousel-arrow right"
                >
                  <ChevronRightIcon />
                </button>
              )
            }
            renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={clickHandler}
                  title={labelPrev}
                  className="carousel-arrow left "
                >
                  <ChevronLeftIcon />
                </button>
              )
            }
          >
            {user?.profile?.portfolio?.map((video, index) => (
              <div key={index} className="carousel-item">
                <ReactPlayer controls={true} width={"100%"} url={video} />
              </div>
            ))}
          </Carousel>
          <div className="name-category-booknow">
            <div className="name-category">
              <div className="name">{user?.name}</div>
              <div className="category">
                {user?.profile?.category.map((cat, index) => (
                  <div key={index}>{cat}</div>
                ))}
              </div>
              <div className="pricing">
                {" "}
                Pricing {user?.profile?.pricing?.min}
                <CurrencyRupee fontSize="0.7rem" /> -{" "}
                {user?.profile?.pricing?.max}
                <CurrencyRupee fontSize="0.7rem" />
              </div>
              <div className="pricing">{user?.profile?.location}</div>
            </div>
            <button className="book-now-btn" onClick={handleBookNowClick}>
              Book Now
            </button>
          </div>
          <div className="description">{user?.profile?.description}</div>

          <Box
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              width: "70%",
              alignItems: "flex-start",
              fontSize: "12px",
            }}
          >
            <Typography variant="h6" sx={{ marginTop: 3 }}>
              Customer reviews
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="h6" sx={{ marginLeft: 1, fontSize: "12px" }}>
                {averageRating} out of 5
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "12px" }}
              variant="body2"
              color="textSecondary"
            >
              {totalRatings} global ratings
            </Typography>
            <Box sx={{ width: "80%", marginTop: 2, fontSize: "12px" }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Grid container alignItems="center" key={star}>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: "12px", color: "black" }}>
                      {star} star
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <CustomLinearProgress
                      variant="determinate"
                      value={
                        distribution[star]
                          ? (distribution[star] / totalRatings) * 100
                          : 0
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: "12px", color: "black" }}>
                      {(
                        ((distribution[star] || 0) / totalRatings) *
                        100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>
            <Box
              sx={{
                marginTop: 3,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontSize: "12px",
              }}
            >
              <Typography variant="h6">User Ratings</Typography>
              <List>
                {ratings.length &&
                  ratings.map((r, index) => (
                    <ListItem alignItems="flex-start" key={index}>
                      <ListItemAvatar>
                        <Avatar></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "12px",
                            }}
                          >
                            <Rating value={r.rating} readOnly />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ marginLeft: 1, fontSize: "12px" }}
                            >
                              {formatDistanceToNow(new Date(r.createdAt))} ago
                            </Typography>
                          </Box>
                        }
                        secondary={r.comment}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>
            {isloggedin && (
              <Box
                sx={{
                  marginTop: 3,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  fontSize: "12px",
                }}
              >
                <Typography variant="h6">Give a Rating</Typography>
                <Rating
                  value={userRating}
                  onChange={(event, newValue) => setUserRating(newValue)}
                  precision={1}
                />
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Leave a comment"
                  rows={4}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    resize: "none",
                    fontSize: "12px",
                  }}
                />
                <Button
                  onClick={submitRating}
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid black",
                    },
                  }}
                >
                  Submit Rating
                </Button>
              </Box>
            )}
          </Box>
        </div>
      </div>
      <Dialog
        open={showDatePicker}
        onClose={() => handleDatePickerClose(false)}
      >
        <DialogTitle>Select Booking Date</DialogTitle>
        <DialogContent>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            timeCaption="time"
            inline
          />
          <TextField
            label="Location"
            variant="outlined"
            value={bookingLocation}
            onChange={(e) => setBookingLocation(e.target.value)}
            required
            fullWidth
            sx={{ marginTop: "1rem" }}
          />
          <TextField
            label="Message"
            multiline
            rows={4}
            variant="outlined"
            value={bookingMessage}
            onChange={(e) => setBookingMessage(e.target.value)}
            fullWidth
            sx={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDatePickerClose(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={() => handleDatePickerClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bookingConfirmed}
        onClose={() => setBookingConfirmed(false)}
      >
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Your booking has been confirmed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingConfirmed(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserPage;
