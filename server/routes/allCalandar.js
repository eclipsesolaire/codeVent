const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Lettre = require('../models/lettre');

// POST - Créer une nouvelle lettre
router.post('/', async (req, res) => {
  try {
    console.log('📝 Tentative de création:', req.body);
    
    const { title, createdAt } = req.body;
    
    if (!title) {
      console.log('❌ Title manquant');
      return res.status(400).json({ error: 'title requis' });
    }

    

    const lettre = new Lettre({ title, createdAt });
    await lettre.save();
    
    console.log('✅ Lettre créée:', lettre);

    const responseData = {
      _id: lettre._id,
      title: lettre.title,
      createdAt: new Date(lettre.createdAt).toLocaleString('fr-FR'),
      updatedAt: new Date(lettre.updatedAt).toLocaleString('fr-FR'),
      __v: lettre.__v
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('❌ Erreur POST /lettres:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la création',
      message: error.message 
    });
  }
});

// GET - Récupérer toutes les lettres
router.get('/', async (req, res) => {
  try {
    console.log('📖 Tentative de récupération des lettres...');
    
    // Vérifier la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB non connecté, état:', mongoose.connection.readyState);
      return res.status(500).json({ 
        error: 'Base de données non connectée',
        connectionState: mongoose.connection.readyState
      });
    }
    
    const lettres = await Lettre.find({});
    console.log(`✅ ${lettres.length} lettres récupérées`);
    
    // Log des première lettres pour debug
    if (lettres.length > 0) {
      console.log('📋 Première lettre:', lettres[0]);
    }
    
    res.json(lettres);
  } catch (error) {
    console.error('❌ Erreur GET /lettres:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération',
      message: error.message,
      stack: error.stack
    });
  }
});

// GET - Récupérer une lettre par ID
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Recherche lettre ID:', req.params.id);
    
    const lettre = await Lettre.findById(req.params.id);
    if (!lettre) {
      console.log('❌ Lettre non trouvée');
      return res.status(404).json({ error: 'lettre non trouvée' });
    }
    
    console.log('✅ Lettre trouvée:', lettre);
    res.json(lettre);
  } catch (err) {
    console.error('❌ Erreur GET /lettres/:id:', err);
    res.status(400).json({ error: 'ID invalide', message: err.message });
  }
});

// DELETE - Supprimer une lettre
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Tentative suppression ID:', req.params.id);
    
    const deleted = await Lettre.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      console.log('❌ Lettre à supprimer non trouvée');
      return res.status(404).json({ error: 'lettre pas trouvée' });
    }
    
    console.log('✅ Lettre supprimée:', deleted);
    res.json({ message: 'lettre supprimée', deleted });
  } catch (err) {
    console.error('❌ Erreur DELETE /lettres/:id:', err);
    res.status(400).json({ error: 'ID invalide', message: err.message });
  }
});

// PUT - Modifier une lettre
router.put('/:id', async (req, res) => {
  try {
    console.log('✏️ Tentative modification ID:', req.params.id, 'Data:', req.body);
    
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title requis' });
    }

    const updated = await Lettre.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      console.log('❌ Lettre à modifier non trouvée');
      return res.status(404).json({ error: 'lettre non trouvée' });
    }

    console.log('✅ Lettre modifiée:', updated);
    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur PUT /lettres/:id:', err);
    res.status(400).json({ 
      error: 'ID invalide ou erreur de validation', 
      message: err.message 
    });
  }
});

module.exports = router;