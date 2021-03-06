import express from "express";
import {
  processLogin,
  getUserProfile,
  registerNewUser,
  getAllUsers,
  updateUserProfile,
  changePassword,
  resetPassword,
} from "../controller/index.js";
import { protectRoute, adminOnly } from "../middleware/index.js";

export const userRoutes = express.Router();

userRoutes.route("/").get(protectRoute, adminOnly, getAllUsers);
userRoutes.post("/register", registerNewUser);
userRoutes.post("/login", processLogin);
userRoutes
  .route("/profile")
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);
userRoutes.route("/change-password").post(protectRoute, changePassword);
userRoutes
  .route("/reset-password")
  .post(protectRoute, adminOnly, resetPassword);
