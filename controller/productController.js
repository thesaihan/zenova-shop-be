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

/**
 * @description Create new product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, user: req.user._id });
  res.json(product);
});

/**
 * @description Update product by id
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const prodId = req.params.id;
  if (!prodId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Product ID : " + prodId);
  } else {
    const product = await Product.findById(prodId);
    if (product) {
      Object.assign(product, {
        ...req.body,
        user: req.user._id,
        _id: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });
      res.json(await product.save());
    } else {
      res.status(404);
      throw new Error("Product Not Found : " + prodId);
    }
  }
});

/**
 * @description Delete product by id
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const prodId = req.params.id;
  if (!prodId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Product ID : " + prodId);
  } else {
    const product = await Product.findById(prodId);
    if (product) {
      await product.delete();
      res.json({ success: true, message: "Successfully deleted the product" });
    } else {
      res.status(404);
      throw new Error("Product Not Found : " + prodId);
    }
  }
});
