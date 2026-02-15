import mongoose from "mongoose";
const profileSchema1 = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: [String],
  description: String,
  expertise: String,
  portfolio: [String],
  pricing: {
    min: { type: Number },
    max: { type: Number },
  },
  location: String,
  profileImage: String,
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: { type: Number, required: true, min: 0, max: 5 },
      createdAt: { type: Date, default: Date.now },
      comment: String,
    },
  ],
});

const profileSchema = mongoose.model(
  "profiles",
  profileSchema1,
  "UserProfiles"
);

export default profileSchema;
