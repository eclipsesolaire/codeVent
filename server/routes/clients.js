const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des clients:', err);
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

// Create new client
router.post('/', async (req, res) => {
    try {
        console.log('📝 Données reçues:', req.body);
        
        const { name, contact } = req.body;
        
        if (!name || !contact) {
            return res.status(400).json({
                message: 'Données invalides',
                error: 'Le nom et le contact sont requis'
            });
        }

        const client = new Client({
            name: name.trim(),
            contact: contact.trim(),
            accepted: false
        });

        console.log('🔄 Tentative de création du client:', client);

        await client.save();
        console.log('✅ Client créé avec succès:', client);
        res.status(201).json(client);
    } catch (err) {
        console.error('❌ Erreur lors de la création du client:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

// Update client (for accepting/rejecting)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        
        if (update.accepted === true && !update.acceptedAt) {
            update.acceptedAt = new Date();
        }
        
        const client = await Client.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        );
        
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        
        res.json(client);
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du client:', err);
        res.status(400).json({ message: 'Erreur de mise à jour', error: err.message });
    }
});

// Delete client
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);
        
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        
        res.json({ message: 'Client supprimé avec succès' });
    } catch (err) {
        console.error('❌ Erreur lors de la suppression du client:', err);
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

module.exports = router;