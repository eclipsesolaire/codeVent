const mongoose = require('mongoose');

const lettreSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { 
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
  }
);

// Middleware pour log les opérations
lettreSchema.pre('save', function(next) {
  console.log('💾 Sauvegarde lettre:', this.title);
  next();
});

lettreSchema.post('save', function(doc) {
  console.log('✅ Lettre sauvegardée:', doc._id);
});

lettreSchema.pre('find', function() {
  console.log('🔍 Recherche lettres...');
});

lettreSchema.post('find', function(docs) {
  console.log(`📊 ${docs.length} lettres trouvées`);
});

module.exports = mongoose.model('Lettre', lettreSchema);