import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    // required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const bookingSchema1 = new mongoose.Schema({
  talentSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  talentArtist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
  messages: [messageSchema],
});

const bookingSchema = mongoose.model("Booking", bookingSchema1, "Bookings");

export default bookingSchema;
