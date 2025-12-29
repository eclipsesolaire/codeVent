const mongoose = require('mongoose');

const calandarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    day: { type: Number, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    // AJOUT des propriétés manquantes
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CalandarElement', calandarSchema);