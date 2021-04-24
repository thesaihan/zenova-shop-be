import express from "express";
import multer from "multer";
import path from "path";
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMG_UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        Math.round(Math.random() * 1000) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    try {
      const imgRegex = /jpg|jpeg|png/;
      const isImage = imgRegex.test(
        path.extname(file.originalname).toLowerCase()
      );
      const isMimeImage = imgRegex.test(file.mimetype);

      cb(null, isImage && isMimeImage);
    } catch (error) {
      cb(error);
    }
  },
});

productRoutes
  .route("/images/upload")
  .post(upload.single("image"), (req, res) => {
    res.json({ success: true, imagePath: "/" + req.file.filename });
  });
