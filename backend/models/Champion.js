const mongoose = require('mongoose');
const { Schema } = mongoose;

const championSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: String,

    // Location
    cluster: {
        type: String,
        required: true,
        enum: ['jaipur_block_print', 'kutch_embroidery', 'moradabad_metalwork', 'kashmir_handicrafts', 'other']
    },
    region: String,
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' }
    },

    // Languages
    languages: [{
        type: String,
        enum: ['hindi', 'english', 'gujarati', 'bengali', 'tamil', 'punjabi', 'marathi', 'kannada', 'telugu', 'other']
    }],

    // Assigned Artisans
    artisans: [{
        type: Schema.Types.ObjectId,
        ref: 'Artisan'
    }],

    // Performance Metrics
    onboardedArtisans: { type: Number, default: 0 },
    activationsThisMonth: { type: Number, default: 0 },
    totalActivations: { type: Number, default: 0 },
    averageActivationTime: { type: Number, default: 0 }, // in hours

    // Commission & Payments
    commissionRate: { type: Number, default: 0.02 }, // 2% default
    totalEarned: { type: Number, default: 0 },
    pendingPayment: { type: Number, default: 0 },

    // Training & Certification
    trainingSessions: [{
        topic: String,
        completedAt: Date,
        score: Number,
        certificateUrl: String
    }],

    // Status
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
    lastActiveAt: Date,

    // Contact Details
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String,
        upiId: String
    }
}, {
    timestamps: true
});

// Indexes
championSchema.index({ phone: 1 });
championSchema.index({ cluster: 1 });
championSchema.index({ isActive: 1 });
championSchema.index({ onboardedArtisans: -1 });

module.exports = mongoose.model('Champion', championSchema);