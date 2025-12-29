const express = require('express');
const router = express.Router();
const PriceWork = require('../models/priceWork');

// Route pour créer un élément
router.post('/', async (req, res) => {
  try {
    console.log(" création d'un élément:", req.body);

    const { title, price } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        error: "Le titre et le prix sont requis.",
      });
    }

    const newElement = new PriceWork({ title, price });

    await newElement.save();

    res.json({
      message: "Élément créé avec succès.",
      data: {
        _id: newElement._id,
        title: newElement.title,
        price: newElement.price,
        createdAt: newElement.createdAt,
      },
    });

  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la création. Veuillez réessayer." });
  }
});

// Route pour supprimer un élément par ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PriceWork.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Élément non trouvé." });
    }

    res.json({
      message: "L'élément a été supprimé avec succès.",
      deleted,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la suppression." });
  }
});

router.get("/", async (req, res) => {
  try {
    const allWorks = await PriceWork.find().sort({ createdAt: -1 }); // trié du plus récent au plus ancien
    res.json(allWorks);
  } catch (error) {
    console.error("Erreur lors de la récupération des éléments :", error);
    res.status(500).json({ error: "Erreur lors du chargement des données." });
  }
});

module.exports = router;
