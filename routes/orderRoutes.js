import express from "express";
import {
  createNewOrder,
  getOrderById,
  markOrderAsPaid,
} from "../controller/index.js";
import { protectRoute } from "../middleware/index.js";

export const orderRoutes = express.Router();

orderRoutes.route("/").post(protectRoute, createNewOrder);
orderRoutes.route("/:id").get(protectRoute, getOrderById);
orderRoutes.route("/:id/pay").put(protectRoute, markOrderAsPaid);
