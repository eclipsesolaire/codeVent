const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const PORT = 3000;

// Configuration CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de debug
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, req.body);
  next();
});


const uri = 'mongodb+srv://djibybadiaga971:7Fq7MV2amWL1VrEo@cluster0.p6ggpnt.mongodb.net/companyDb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connecté à MongoDB Atlas');

  // Petit test de lecture
  const Lettre = require('./models/lettre');
  Lettre.find({})
    .then(lettres => console.log(`📊 ${lettres.length} lettres trouvées dans la base`))
    .catch(err => console.error('❌ Erreur lors du test de lecture:', err));
})
.catch(err => {
  console.error('❌ Erreur connexion MongoDB:', err);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB déconnecté');
});

// =======================
// 📁 Routes
// =======================
const allCalandarRoutes = require('./routes/allCalandar');
const calandarDayRoutes = require('./routes/calandarForDay');
const lettreRoutes = require('./routes/lettres');
const priceWorkRoutes = require('./routes/allPriceWork');
const grossIncomeRoutes = require('./routes/grossIncome');
const clientRoutes = require('./routes/clients');

app.use('/lettres', lettreRoutes);
app.use('/calandar', allCalandarRoutes);
app.use('/calandarday', calandarDayRoutes);
app.use('/pricework', priceWorkRoutes);
app.use('/grossincome', grossIncomeRoutes);
app.use('/api/clients', clientRoutes);

// Route de test
app.get('/test', (req, res) => {
  res.json({
    message: 'Serveur fonctionnel',
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState
  });
});

// Gestion des routes non trouvées
app.use((req, res, next) => {
  if (req.path === '/ws' || req.path === '/manifest.json') {
    return res.status(404).end();
  }
  
  // Pour les requêtes API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      message: 'Route non trouvée',
      path: req.path
    });
  }
  
  next();
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(err.status || 500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// =======================
// 🚀 Lancement serveur
// =======================
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 API Clients: http://localhost:${PORT}/api/clients`);
  console.log(`🔗 Test: http://localhost:${PORT}/test`);
  console.log(`📋 Lettres: http://localhost:${PORT}/lettres`);
  console.log(`📋 Gross Income: http://localhost:${PORT}/grossincome`);
});

// passeword database 7Fq7MV2amWL1VrEo
// mongodb+srv://djibybadiaga971:7Fq7MV2amWL1VrEo@cluster0.p6ggpnt.mongodb.net/