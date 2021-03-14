const express = require("express");
const products = require("./data/products");

const app = express();

app.get("/", (req, res) => res.send("Backend API server is running..."));

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/product/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = 5000;
app.listen(
  PORT,
  console.log(`Backend Express Server is tarting on port ${PORT}`)
);
