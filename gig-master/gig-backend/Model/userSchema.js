import mongoose from "mongoose";
const userSchema1 = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  mobileNumber:{
    type:String
  },
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
  roles: {
    type: [String],
    enum: ["talent_seeker", "talent_artist"],
    default: ["talent_seeker"],
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const userSchema = mongoose.model("user", userSchema1, "Users");

export default userSchema;
