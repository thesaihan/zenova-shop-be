import asyncHandler from "express-async-handler";
import { Product } from "../model/index.js";

/**
 * @description Fetch all products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/**
 * @description Fetch product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const prodId = req.params.id;
  if (!prodId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Product ID : " + prodId);
  } else {
    const product = await Product.findById(prodId);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product Not Found : " + prodId);
    }
  }
});
