import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@zenova.com",
    password: bcrypt.hashSync("admin", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("john123", 10),
    isAdmin: false,
  },
  {
    name: "James Taylor",
    email: "james@gmail.com",
    password: bcrypt.hashSync("james123", 10),
    isAdmin: false,
  },
];

export default users;
