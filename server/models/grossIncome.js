const mongoose = require('mongoose');

const grossIncomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'income' },
  month: { type: String, required: true }, // 🔹 le mois choisi
}, { timestamps: true });

module.exports = mongoose.model('GrossIncome', grossIncomeSchema);
