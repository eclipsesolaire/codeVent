const express = require('express');
const router = express.Router();
const GrossIncome = require('../models/grossIncome');

// GET - Récupérer tous les revenus
router.get('/', async (req, res) => {
  try {
    const items = await GrossIncome.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('❌ Erreur GET /grossincome:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, amount, category, month } = req.body;

    if (!title || amount === undefined || !month) { 
      return res.status(400).json({ error: 'title, amount et month sont requis' });
    }

    const newIncome = new GrossIncome({ 
      title, 
      amount: Number(amount), 
      category: category || 'income',
      month
    });

    await newIncome.save();
    res.status(201).json(newIncome);

  } catch (err) {
    console.error('❌ Erreur POST /grossincome:', err);
    res.status(500).json({ error: err.message });
  }
});


// PUT - Modifier un revenu
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    
    const updated = await GrossIncome.findByIdAndUpdate(
      req.params.id,
      { title, amount: Number(amount), category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Revenu non trouvé' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur PUT /grossincome:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Supprimer un revenu
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await GrossIncome.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Revenu non trouvé' });
    }

    res.json({ message: 'Revenu supprimé avec succès' });
  } catch (err) {
    console.error('❌ Erreur DELETE /grossincome:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 