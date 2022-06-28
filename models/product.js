const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdcutSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mpns: {
      type: String,
      required: true,
    },
    manifactuler: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    searchId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", ProdcutSchema);

module.exports = Product;
