import express from "express";
import dotevn from "dotenv";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/db.js";
import { productRoutes } from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/index.js";

dotevn.config();

connectDB();

const app = express();

// Middleware
app.use(cors());

// Routes
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("Backend API server is running..."));

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Backend Express Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .blue.bold
  )
);
