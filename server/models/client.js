const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du client est requis'],
        trim: true
    },
    contact: {
        type: String,
        required: [true, "L'email ou le numéro de téléphone est requis"],
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return false;
                // Nettoie la valeur
                const value = v.trim();
                // Valide si c'est un email ou un numéro de téléphone
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^[\d\s+\-()]{8,}$/; // Plus permissif pour les numéros de téléphone
                const isEmail = emailRegex.test(value);
                const isPhone = phoneRegex.test(value.replace(/[^\d]/g, '')); // Ne garde que les chiffres pour la validation
                console.log('🔍 Validation contact:', { value, isEmail, isPhone });
                return isEmail || isPhone;
            },
            message: props => `${props.value} n'est pas un email ou numéro de téléphone valide. Formats acceptés: email@domaine.com ou 06 12 34 56 78`
        }
    },
    accepted: {
        type: Boolean,
        default: false
    },
    acceptedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

module.exports = mongoose.model('Client', clientSchema);