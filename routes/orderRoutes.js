import express from "express";
import {
  createNewOrder,
  getOrderById,
  getOrdersForCurrentUser,
  markOrderAsDelivered,
  markOrderAsPaid,
  getUnpaidOrders,
  getPaidOrdersToDeliver,
  getDeliveredOrders,
} from "../controller/index.js";
import { protectRoute, adminOnly } from "../middleware/index.js";

export const orderRoutes = express.Router();

orderRoutes.route("/").post(protectRoute, createNewOrder);
orderRoutes.route("/").get(protectRoute, getOrdersForCurrentUser);
orderRoutes.route("/unpaid").get(protectRoute, adminOnly, getUnpaidOrders);
orderRoutes
  .route("/delivered")
  .get(protectRoute, adminOnly, getDeliveredOrders);
orderRoutes
  .route("/paid-but-not-delivered")
  .get(protectRoute, adminOnly, getPaidOrdersToDeliver);
orderRoutes.route("/:id").get(protectRoute, getOrderById);
orderRoutes.route("/:id/pay").put(protectRoute, markOrderAsPaid);
orderRoutes
  .route("/:id/deliver")
  .put(protectRoute, adminOnly, markOrderAsDelivered);
