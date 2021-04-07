import asyncHander from "express-async-handler";
import { User } from "../model/index.js";
import bcrypt from "bcryptjs";

/**
 * @description Auth user login
 * @route POST /api/users/login
 * @access Public
 */
export const processLogin = asyncHander(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        access_token: null,
      });
    } else {
      res.status(401);
      throw new Error("Incorrect email and password");
    }
  } else {
    res.status(400);
    throw new Error("Please enter email and password");
  }
});
