import express from "express";
import { loginController, registerController } from "../Controllers/auth.js";
import authenticateUser from "../middlewares/authenticateGoogleUser.js";
import { OAuth2Client, auth } from "google-auth-library";
import cookieParser from "cookie-parser";
const authRouter = express.Router();
import Joi from "joi";
import User from "../Model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {  resetPassword } from "../Controllers/resetPassword.js";

authRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-auth,Origin,Content-Type,Accept"
  );
  next();
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

authRouter.use(cookieParser());

authRouter.post('/reset-password', resetPassword);
//google login
authRouter.post("/login/user", async (req, res) => {
  const client = new OAuth2Client(
    "655936708831-6cv2t8h7v7gu3j7l0ibcsdg5dh59ikvb.apps.googleusercontent.com"
  );
  const { authId } = req.body;
  console.log(0);
  try {
    const ticket = await client.verifyIdToken({
      idToken: authId,
      audience:
        "655936708831-6cv2t8h7v7gu3j7l0ibcsdg5dh59ikvb.apps.googleusercontent.com",
    });
    console.log(1);

    const { name, email, picture } = ticket.getPayload();
    console.log(name, email);
    console.log(2);

    const loginToken = jwt.sign(`${email}`, "thisisthesecretkey");
    console.log(3);
    const user = await User.findOne({ email });
    console.log(4);

    if (!user) {
      // If user doesn't exist, create a new one with additionalInfo
      const newUser = new User({
        email,
        name,
      });
      await newUser.save();
      return newUser;
    }

    res
      .status(200)
      .cookie("login", loginToken, user, { expire: 360000 + Date.now() })
      .send({ userId: user._id,roles:user.roles });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

authRouter.get("/logout/user", async (req, res) => {
  //logout function
  try {
    res.clearCookie("login").send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

authRouter.get("/user/checkLoginStatus", authenticateUser, async (req, res) => {
  //check if user is logged in already
  try {
    res.status(200).send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log(0);
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
    // res.status(200).send({ accessToken: token, user_id: user._id });
    res
      .status(200)
      .cookie("login", token, { expire: 360000 + Date.now() })
      .send({ userId: user._id ,roles:user.roles});
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
authRouter.post("/register", registerController);

export default authRouter;
