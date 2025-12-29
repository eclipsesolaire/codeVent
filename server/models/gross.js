const mongoose = require('mongoose');

const Gross = new mongoose.Schema(
  {
    priceGraph: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gross", Gross);
