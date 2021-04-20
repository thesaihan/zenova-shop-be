import asyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../model/index.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (bearerToken) {
    const bearer = "Bearer ";
    if (bearerToken.startsWith(bearer)) {
      const token = bearerToken.split(bearer)[1];
      if (token) {
        const decoded = jsonwebtoken.verify(token, process.env.TOKEN);
        if (decoded && decoded._id) {
          const user = await User.findById(decoded._id);
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(404);
            throw new Error("User not found : " + decoded._id);
          }
        } else {
          res.status(401);
          throw new Error("No user id in access token");
        }
      } else {
        res.status(401);
        throw new Error("No bearer token specified");
      }
    } else {
      res.status(401);
      throw new Error("Not a bearer token");
    }
  } else {
    res.status(401);
    throw new Error("No access token specified");
  }
});

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Only Zenova shop admin has access");
  }
};
