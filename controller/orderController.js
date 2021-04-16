import asyncHander from "express-async-handler";
import { Order } from "../model/index.js";

/**
 * @description Create new order
 * @route POST /api/orders
 * @access Private
 */
export const createNewOrder = asyncHander(async (req, res) => {
  const {
    orderItems,
    shippingInfo,
    paymentMethod,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
  } = req.body;
  if (!(orderItems && orderItems.length > 0)) {
    res.status(400);
    throw new Error("Missing order items");
  } else if (!shippingInfo) {
    res.status(400);
    throw new Error("Missing shipping info");
  } else if (!paymentMethod) {
    res.status(400);
    throw new Error("Missing payment method");
  }

  const createdOrder = await Order.create({
    user: req.user._id,
    orderItems,
    shippingInfo,
    paymentMethod,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
  });
  res.json(createdOrder);
});
