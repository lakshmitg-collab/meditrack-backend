const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  expiryDate: { type: Date },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Medicine", medicineSchema);
