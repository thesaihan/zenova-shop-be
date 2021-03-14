import express from "express";
import dotevn from "dotenv";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/db.js";
import products from "./data/products.js";

dotevn.config();

connectDB();

const app = express();

// Middleware
app.use(cors());

app.get("/", (req, res) => res.send("Backend API server is running..."));

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/product/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Backend Express Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .blue.bold
  )
);
