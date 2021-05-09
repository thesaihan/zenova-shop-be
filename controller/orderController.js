import asyncHandler from "express-async-handler";
import { Order } from "../model/index.js";

/**
 * @description Create new order
 * @route POST /api/orders
 * @access Private
 */
export const createNewOrder = asyncHandler(async (req, res) => {
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

/**
 * @description Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    res.status(400);
    throw new Error("Missing Order ID");
  } else if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Order ID : " + orderId);
  } else {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found : " + orderId);
    }
  }
});

/**
 * @description Get orders for currently logged in user
 * @route GET /api/orders
 * @access Private
 */
export const getOrdersForCurrentUser = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(orders);
});

/**
 * @description Get paid orders that admin needs to mark as delivered
 * @route GET /api/orders/paid-but-not-delivered?page=1&size=10
 * @access Private/Admin
 */
export const getPaidOrdersToDeliver = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;
  if (page < 1) {
    res.status(400);
    throw new Error("Invalid page number : " + page);
  }
  if (size < 1) {
    res.status(400);
    throw new Error("Invalid page size : " + size);
  }
  const filter = { isPaid: true, isDelivered: false };
  const orders = await Order.find(filter)
    .limit(size)
    .skip(page - 1)
    .sort("-createdAt")
    .populate("user", "name email");
  const totalElements = await Order.find(filter).countDocuments();
  const totalPages = Math.ceil(totalElements / size);
  res.json({ contents: orders, page, size, totalElements, totalPages });
});

/**
 * @description Get delivered orders
 * @route GET /api/orders/delivered?page=1&size=10
 * @access Private/Admin
 */
export const getDeliveredOrders = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;
  if (page < 1) {
    res.status(400);
    throw new Error("Invalid page number : " + page);
  }
  if (size < 1) {
    res.status(400);
    throw new Error("Invalid page size : " + size);
  }
  const filter = { isDelivered: true };
  const orders = await Order.find(filter)
    .limit(size)
    .skip(page - 1)
    .sort("-createdAt")
    .populate("user", "name email");
  const totalElements = await Order.find(filter).countDocuments();
  const totalPages = Math.ceil(totalElements / size);
  res.json({ contents: orders, page, size, totalElements, totalPages });
});

/**
 * @description Get unpaid orders
 * @route GET /api/orders/unpaid?page=1&size=10
 * @access Private/Admin
 */
export const getUnpaidOrders = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;
  if (page < 1) {
    res.status(400);
    throw new Error("Invalid page number : " + page);
  }
  if (size < 1) {
    res.status(400);
    throw new Error("Invalid page size : " + size);
  }
  const filter = { isPaid: false };
  const orders = await Order.find(filter)
    .limit(size)
    .skip(page - 1)
    .sort("-createdAt")
    .populate("user", "name email");
  const totalElements = await Order.find(filter).countDocuments();
  const totalPages = Math.ceil(totalElements / size);
  res.json({ contents: orders, page, size, totalElements, totalPages });
});

/**
 * @description Set order as paid according ID specified
 * @route PUT /api/orders/:id/pay
 * @access Private
 */
export const markOrderAsPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { id, status, update_time, payer } = req.body;
  if (!orderId) {
    res.status(400);
    throw new Error("Missing Order ID");
  } else if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Order ID : " + orderId);
  } else {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id,
        status,
        update_time,
        email_address: payer.email_address,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found : " + orderId);
    }
  }
});

/**
 * @description Set order as delivered according ID specified
 * @route PUT /api/orders/:id/deliver
 * @access Private/Admin
 */
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    res.status(400);
    throw new Error("Missing Order ID");
  } else if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Order ID : " + orderId);
  } else {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (order) {
      if (!order.isPaid) {
        res.status(406);
        throw new Error("Order is not paid : " + orderId);
      }
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found : " + orderId);
    }
  }
});
