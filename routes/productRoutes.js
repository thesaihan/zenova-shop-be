import express from "express";
import asyncHandler from "express-async-handler";
import { Product } from "../model/index.js";

export const productRoutes = express.Router();

/**
 * @description Fetch all products
 * @route GET /api/products
 * @access Public
 */
productRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

/**
 * @description Fetch product by ID
 * @route GET /api/products/:id
 * @access Public
 */
productRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const prodId = req.params.id;
    if (!prodId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid Product ID : " + prodId });
    }
    const product = await Product.findById(prodId);
    product
      ? res.json(product)
      : res.status(404).json({ message: "Product Not Found : " + prodId });
  })
);
