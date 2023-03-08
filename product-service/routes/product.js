const express = require("express");
const ProductModel = require("../models/Product");

const routes = express.Router();

routes.post("/", (req, res) => {
  const product = new ProductModel(req.body);

  product
    .save()
    .then((prod) => {
      res.json({ message: "Produit sauvegarde", prod });
    })
    .catch((err) => {
      res.sendStatus(500).json({ message: err });
    });
});

routes.post("/buy", (req, res) => {});

module.exports = routes;
