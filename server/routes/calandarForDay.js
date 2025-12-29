const express = require('express');
const router = express.Router();

const CalandarElement = require('../models/calandarElement');

// GET / → récupérer tous les événements (optionnel avec filtres)
router.get('/', async (req, res) => {
  try {
    const { year, month, day } = req.query;
    
    // Construire le filtre dynamiquement
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (month !== undefined) filter.month = parseInt(month); // month peut être 0
    if (day) filter.day = parseInt(day);
    
    const events = await CalandarElement.find(filter).sort({ 
      year: 1, 
      month: 1, 
      day: 1, 
      start: 1 
    });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// POST / → enregistrer un "CalandarElement"
router.post('/', async (req, res) => {
  try {
    const { title, day, start, end, year, month } = req.body;
    
    // Validation des champs requis
    if (!title || day == null || start == null || end == null || year == null || month == null) {
      return res.status(400).json({ 
        error: 'Champs manquants. Requis: title, day, start, end, year, month' 
      });
    }
    
    // Validation des valeurs
    if (start >= end) {
      return res.status(400).json({ 
        error: 'L\'heure de fin doit être supérieure à l\'heure de début' 
      });
    }
    
    if (start < 7 || start > 18 || end < 7 || end > 18) {
      return res.status(400).json({ 
        error: 'Les heures doivent être entre 7 et 18' 
      });
    }
    
    if (day < 1 || day > 31) {
      return res.status(400).json({ 
        error: 'Le jour doit être entre 1 et 31' 
      });
    }
    
    if (month < 0 || month > 11) {
      return res.status(400).json({ 
        error: 'Le mois doit être entre 0 (janvier) et 11 (décembre)' 
      });
    }
    
    // Vérifier si le jour existe dans le mois/année donnés
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (day > daysInMonth) {
      return res.status(400).json({ 
        error: `Le jour ${day} n'existe pas dans ce mois` 
      });
    }
    
    // Vérifier les conflits d'horaires (optionnel)
    const conflictingEvent = await CalandarElement.findOne({
      year, month, day,
      $or: [
        { start: { $lt: end, $gte: start } },
        { end: { $gt: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } }
      ]
    });
    
    if (conflictingEvent) {
      return res.status(400).json({ 
        error: 'Conflit d\'horaire avec un événement existant',
        conflictWith: conflictingEvent.title
      });
    }
    
    // Créer l'événement
    const element = new CalandarElement({ 
      title: title.trim(), 
      day, start, end, year, month 
    });
    
    await element.save();
    
    res.status(201).json(element); // Retourne directement l'élément créé
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// PUT /:id → modifier un "CalandarElement"
router.put('/:id', async (req, res) => {
  try {
    const { title, day, start, end, year, month } = req.body;
    
    // Validation des champs requis
    if (!title || day == null || start == null || end == null || year == null || month == null) {
      return res.status(400).json({ 
        error: 'Champs manquants. Requis: title, day, start, end, year, month' 
      });
    }
    
    // Validation des valeurs (même que POST)
    if (start >= end) {
      return res.status(400).json({ 
        error: 'L\'heure de fin doit être supérieure à l\'heure de début' 
      });
    }
    
    const updatedElement = await CalandarElement.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), day, start, end, year, month },
      { new: true, runValidators: true }
    );
    
    if (!updatedElement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    res.json(updatedElement);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// DELETE /:id → supprimer un "CalandarElement"
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CalandarElement.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    res.json({ 
      message: 'Événement supprimé avec succès',
      deletedEvent: deleted
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// GET /:id → récupérer un événement spécifique
router.get('/:id', async (req, res) => {
  try {
    const event = await CalandarElement.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

module.exports = router;