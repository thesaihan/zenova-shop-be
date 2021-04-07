import jwt from "jsonwebtoken";

const generateToken = (_id) =>
  jwt.sign({ _id }, process.env.TOKEN, {
    expiresIn: process.env.TOKEN_LIFE_SPAN,
  });

export default generateToken;
