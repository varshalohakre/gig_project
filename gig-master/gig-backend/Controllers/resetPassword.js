import Joi from "joi";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../Model/userSchema.js"; // Adjust the path as necessary

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required(),
});
// Request Password Reset Controller
export const resetPassword = async (req, res) => {
  try {
    // Validate request body
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password has been reset");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
