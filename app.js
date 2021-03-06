import express from "express";
import dotevn from "dotenv";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { productRoutes, userRoutes, orderRoutes } from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/index.js";

dotevn.config();

connectDB();

const app = express();

// Middleware
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use("/product/images", express.static(process.env.IMG_UPLOAD_FOLDER));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

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
