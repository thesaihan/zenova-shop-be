import { emailRegex } from "./constants.js";

export const isEmail = (email) => {
  return emailRegex.test(String(email).toLowerCase());
};
