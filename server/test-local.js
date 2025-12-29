const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function testLocalMongo() {
  console.log('🧪 Test MongoDB local...');
  
  // Démarrer MongoDB en mémoire
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  console.log('📡 URI MongoDB local:', mongoUri);
  
  try {
    // Connexion
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB local');
    
    // Test avec le modèle Lettre
    const Lettre = require('./models/lettre');
    
    // Créer une lettre de test
    const testLettre = new Lettre({ title: 'Test lettre' });
    await testLettre.save();
    console.log('✅ Lettre créée:', testLettre._id);
    
    // Lire les lettres
    const lettres = await Lettre.find({});
    console.log(`📊 ${lettres.length} lettres trouvées`);
    
    // Nettoyer
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('✅ Test terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur test local:', error);
    await mongoServer.stop();
  }
}

testLocalMongo(); 