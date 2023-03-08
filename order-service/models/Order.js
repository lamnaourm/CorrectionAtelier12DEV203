const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    products: [
      {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
      },
    ],
    total:Number
  },
  { collection: "orders" }
);

module.exports = mongoose.model("orders", ProductSchema, "orders");
