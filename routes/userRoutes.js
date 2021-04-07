import express from "express";
import { processLogin } from "../controller/index.js";

export const userRoutes = express.Router();

userRoutes.post("/login", processLogin);
