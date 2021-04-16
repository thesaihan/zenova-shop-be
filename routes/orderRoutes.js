import express from "express";
import { createNewOrder } from "../controller/index.js";
import { protectRoute } from "../middleware/index.js";

export const orderRoutes = express.Router();

orderRoutes.route("/").post(protectRoute, createNewOrder);
