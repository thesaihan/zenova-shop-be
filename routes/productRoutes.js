import express from "express";
import products from "../data/products.js";

export const productRoutes = express.Router();

productRoutes.get("/", (req, res) => {
  res.json(products);
});

productRoutes.get("/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});
