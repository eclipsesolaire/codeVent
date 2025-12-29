const express = require('express');
const router = express.Router();
const Lettre = require('../models/lettre');

// Get all lettres
router.get('/', async (req, res) => {
  try {
    const lettres = await Lettre.find().sort({ createdAt: -1 });
    res.json(lettres);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des lettres:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Create new lettre
router.post('/', async (req, res) => {
  try {
    const lettre = new Lettre(req.body);
    await lettre.save();
    res.status(201).json(lettre);
  } catch (err) {
    console.error('❌ Erreur lors de la création de la lettre:', err);
    res.status(400).json({ message: 'Erreur de validation', error: err.message });
  }
});

module.exports = router;