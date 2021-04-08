import express from "express";
import {
  processLogin,
  getUserProfile,
  registerNewUser,
} from "../controller/index.js";
import { protectRoute } from "../middleware/index.js";

export const userRoutes = express.Router();

userRoutes.post("/", registerNewUser);
userRoutes.post("/login", processLogin);
userRoutes.route("/profile").get(protectRoute, getUserProfile);
