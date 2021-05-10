import asyncHandler from "express-async-handler";
import { User } from "../model/index.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { isEmail } from "../utils/functions.js";

/**
 * @description Auth user login
 * @route POST /api/users/login
 * @access Public
 */
export const processLogin = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        access_token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Incorrect email and password");
    }
  } else {
    res.status(400);
    throw new Error("Please enter email and password");
  }
});

/**
 * @description GET logged in user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

/**
 * @description update logged in user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  } else if (!email || !email.trim()) {
    res.status(400);
    throw new Error("Email is required");
  } else if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true }
  ).populate("-password");
  res.json(updatedUser);
});

/**
 * @description GET all users
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/**
 * @description Register new user
 * @route POST /api/users
 * @access Public
 */
export const registerNewUser = asyncHandler(async (req, res) => {
  const { name, email, password, passwordReentered } = req.body;
  if (!(name && email && password && passwordReentered)) {
    res.status(400);
    throw new Error("Missing user info");
  } else if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  } else if (password !== passwordReentered) {
    res.status(400);
    throw new Error("Passwords do not match");
  } else if (password.length < 6 || password.length > 30) {
    res.status(400);
    throw new Error("Password must be between 6 - 30 characters");
  }
  const userExists = await User.findOne({ email }).select("-password");

  if (!userExists) {
    const createdUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password),
    });
    if (createdUser) {
      createdUser.password = undefined;
      res.json(createdUser);
    } else {
      res.status(500);
      throw new Error("Failed to create user : " + email);
    }
  } else {
    res.status(400);
    throw new Error("User already exist : " + email);
  }
});
