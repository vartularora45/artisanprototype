const mongoose = require('mongoose');
const { Schema } = mongoose;

const buyerSchema = new Schema({
    // Basic Info
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, sparse: true },
    whatsappNumber: String,

    // Preferences
    preferredLanguage: {
        type: String,
        default: 'english'
    },

    // Addresses
    addresses: [{
        type: {
            type: String,
            enum: ['home', 'work', 'other']
        },
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false }
    }],

    // Purchase History
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },

    // Preferences
    favoriteCategories: [String],
    favoriteArtisans: [{
        type: Schema.Types.ObjectId,
        ref: 'Artisan'
    }],

    // Communication Preferences
    marketingConsent: { type: Boolean, default: false },
    smsConsent: { type: Boolean, default: true },
    emailConsent: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Indexes
buyerSchema.index({ phone: 1 });
buyerSchema.index({ email: 1 });
buyerSchema.index({ totalOrders: -1 });

module.exports = mongoose.model('Buyer', buyerSchema);