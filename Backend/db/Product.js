const mongoose = require("mongoose");

const prsch = new mongoose.Schema({
  name: String,
  price: String,
  quantity: Number,
  category: String,
  user_id: String,
  company: String,
  user_id: String,
});

module.exports = mongoose.model("Product", prsch, "products");
