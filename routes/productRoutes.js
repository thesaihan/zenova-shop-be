import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/index.js";
import { adminOnly, protectRoute } from "../middleware/authMiddleware.js";

export const productRoutes = express.Router();

productRoutes
  .route("/")
  .get(getProducts)
  .post(protectRoute, adminOnly, createProduct);

productRoutes
  .route("/:id")
  .get(getProductById)
  .put(protectRoute, adminOnly, updateProduct)
  .delete(protectRoute, adminOnly, deleteProduct);
