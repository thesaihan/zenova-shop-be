import express from "express";
import { getProducts, getProductById } from "../controller/index.js";

export const productRoutes = express.Router();

productRoutes.route("/").get(getProducts);

productRoutes.route("/:id").get(getProductById);
