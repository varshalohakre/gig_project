import Joi from "joi";
import User from "../Model/userSchema.js";
import Profile from "../Model/profileSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  "655936708831-6cv2t8h7v7gu3j7l0ibcsdg5dh59ikvb.apps.googleusercontent.com"
);
// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  roles: Joi.array().items(Joi.string()).required(),
  category: Joi.when("roles", {
    is: Joi.array().items(Joi.string().valid("talent_artist")).min(1),
    then: Joi.array().items(Joi.string()).required(),
    otherwise: Joi.array().items(Joi.string()).allow(null, ''),
  }),
  description: Joi.when("roles", {
    is: Joi.array().items(Joi.string().valid("talent_artist")).min(1),
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null, ''),
  }),
  portfolio: Joi.array().items(Joi.string().allow(null, "")).allow(null, "")
});


// Login controller
export const loginController = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log("1");
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password is wrong");
    console.log("2");

    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    console.log(validPass);
    if (!validPass) return res.status(400).send("Email or password is wrong");

    // Create and send JWT token
    const token = jwt.sign({ _id: user._id }, "thegigunicornstartup");
    console.log(4);
    res.status(200).send({ accessToken: token });
    // res.status(200).send({ accessToken: token, user_id: user._id });
    res
      .status(200)
      .cookie("login", token, { expire: 360000 + Date.now() })
      .send(user._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const registerController = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the email is already registered
    console.log(11);
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).send("Email already exists");
    console.log(12);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(13);

    // Determine roles based on request body
    let roles = ["talent_seeker"]; // Default role
    if (req.body.roles && req.body.roles.includes("talent_artist")) {
      roles.push("talent_artist");
    }
    console.log(14);

    // Create the user
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      mobileNumber:req.body.mobileNumber,
      roles: roles,
      name: req.body.name,
    });
    console.log(15);

    // Save the user
    const savedUser = await user.save();
    console.log(16);

    // Create the profile if provided
    if (req.body.roles.includes("talent_artist")) {
    console.log(17);

      const profile = new Profile({
        user: savedUser._id,
        category: req.body.category,
        description: req.body.description,
        portfolio: req.body.portfolio || [],
      });
    console.log(18);

      await profile.save();
    }
    console.log(19);
    res.status(200).send({message : "User registered successfully"});
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};


