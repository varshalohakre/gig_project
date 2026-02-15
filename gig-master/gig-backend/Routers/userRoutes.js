// routes/user.js
import express from "express";
import {
  updateUser,
  deleteUser,
  getUserDetails,
  getAllTalentArtists,
  uploadProfilePhoto,
  getProfilePhoto,
  addRating,
  addRating2,
  getRatings,
  getRatingDistribution,
  getTopTalentArtists,
} from "../Controllers/addupdateUserdetails.js";
import { v2 as cloudinary, v2 } from "cloudinary";
import Profile from "../Model/profileSchema.js";
import Booking from "../Model/bookingSchema.js";
import User from "../Model/userSchema.js";
import multer from 'multer';

cloudinary.config({
  cloud_name: "dmlcl0nin",
  api_key: "787593192497899",
  api_secret: "bSdgk2ADTsQJtg5xDYfROEFDP3k",
});
const userRouter = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

// Upload image route
userRouter.post(
  "/upload/:userId",
  upload.single("profileImage"),
  uploadProfilePhoto
);

userRouter.post(
  "/profile/upload/:userId",
  upload.single("profileImage"),
  uploadProfilePhoto
);
userRouter.get("/profile/upload/:userId", getProfilePhoto);
userRouter.post("/rating/:talentid", addRating2);
userRouter.put("/:userId", updateUser);
userRouter.delete("/:userId", deleteUser);
userRouter.get("/talent-artists", getAllTalentArtists);
userRouter.get("/top-talent-artists", getTopTalentArtists);
userRouter.get("/:userId", getUserDetails);
userRouter.get("/ratings/:talentid", getRatings);
userRouter.get("/ratings-dist/:talentid", getRatingDistribution);

userRouter.post("/book", async (req, res) => {
  try {
    const { talentSeekerId, talentArtistId, date, message,location } = req.body;

    const talentSeeker = await User.findById(talentSeekerId);
    const talentArtist = await User.findById(talentArtistId);

    if (!talentSeeker || !talentArtist) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = new Booking({
      talentSeeker: talentSeekerId,
      talentArtist: talentArtistId,
      date: new Date(date),
      messages: [
        {
          sender: talentSeekerId,
          content: message,
        },
      ],
      location:location
    });

    await booking.save();

    res.status(201).json({ message: "Booking request created", booking });
  } catch (error) {
    console.error("Error creating booking request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/message", async (req, res) => {
  try {
    const { bookingId, senderId, content } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.messages.push({
      sender: senderId,
      content,
    });

    await booking.save();

    res.status(201).json({ message: "Message sent", booking });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/artist/booking-requests/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params; // Ensure this is coming from authenticated user's ID

    // Find bookings where the logged-in user is the talent_artist
    const bookings = await Booking.find({ talentArtist: artistId })
      .sort({ date: 'asc' }) // Sort by date (appointment time) ascending
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    if (!bookings.length) {
      return res.status(404).json({ message: "No booking requests found for this artist" });
    }

    // Extract relevant information for each booking
    const bookingRequests = await Promise.all(bookings.map(async booking => {
      // Find talentSeeker's name and email from the User schema
      const talentSeeker = await User.findById(booking.talentSeeker, 'name email mobileNumber');
      console.log(talentSeeker);
      return {
        bookingId: booking._id,
        talentSeeker: {
          name: talentSeeker.name,
          email: talentSeeker.email,
          mobileNumber:talentSeeker.mobileNumber
        },
        appointmentTime: booking.date,
        location:booking.location, // Use the date field for appointment time
        message: booking.messages[0]?.content,
        status:booking.status// Assuming message content is in the first message
      };
    }));

    res.status(200).json(bookingRequests);
  } catch (error) {
    console.error("Error retrieving booking requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




userRouter.put('/bookings/:id/approve', async (req, res) => {
  try {
    console.log(req.params.id);
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.put('/bookings/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


userRouter.get("/seeker/bookings/:seekerId", async (req, res) => {
  try {
    const { seekerId } = req.params; // Ensure this is coming from authenticated user's ID

    // Find bookings where the logged-in user is the talent_seeker
    const bookings = await Booking.find({ talentSeeker: seekerId })
      .sort({ date: 'asc' }) // Sort by date (appointment time) ascending
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this talent seeker" });
    }

    // Extract relevant information for each booking
    const bookingRequests = await Promise.all(bookings.map(async booking => {
      // Find talentArtist's name and email from the User schema
      const talentArtist = await User.findById(booking.talentArtist, 'name email mobileNumber').lean();

      return {
        bookingId: booking._id,
        talentArtist: {
          name: talentArtist.name,
          email: talentArtist.email,
          mobileNumber:talentArtist.mobileNumber
        },
        appointmentTime: booking.date, // Use the date field for appointment time
        message: booking.messages[0]?.content, // Assuming message content is in the first message
        status: booking.status,
        location:booking.location // Assuming you have a 'status' field in your Booking schema
      };
    }));

    res.status(200).json(bookingRequests);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default userRouter;
