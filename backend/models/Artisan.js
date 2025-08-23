const mongoose = require('mongoose');
const { Schema } = mongoose;

const artisanSchema = new Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        sparse: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },

    // Location & Craft
    cluster: {
        type: String,
        required: true,
        enum: ['jaipur_block_print', 'kutch_embroidery', 'moradabad_metalwork', 'kashmir_handicrafts', 'other']
    },
    craftSpecialty: [{
        type: String,
        required: true
    }],
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' }
    },

    // Languages & Communication
    languages: [{
        type: String,
        required: true,
        enum: ['hindi', 'english', 'gujarati', 'bengali', 'tamil', 'punjabi', 'marathi', 'kannada', 'telugu', 'other']
    }],
    preferredLanguage: {
        type: String,
        required: true
    },

    // KYC & Verification
    kycStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    kycDocuments: {
        governmentId: {
            type: String,
            idType: {
                type: String,
                enum: ['aadhaar', 'pan', 'passport', 'voter_id', 'driving_license']
            },
            idNumber: String,
            verified: { type: Boolean, default: false }
        },
        craftCertification: String,
        partnerNGO: String
    },

    // Profile & Story
    profileImage: String,
    story: {
        text: String,
        audioFile: String,
        videoFile: String,
        languages: [String]
    },

    // Business Details
    businessType: {
        type: String,
        enum: ['individual', 'collective', 'shg', 'cooperative'],
        default: 'individual'
    },
    gstNumber: String,
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String,
        upiId: String
    },

    // Platform Settings
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    },
    subscriptionExpiry: Date,
    isActive: {
        type: Boolean,
        default: true
    },

    // Performance Metrics
    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    // Champion/Support
    champion: {
        type: Schema.Types.ObjectId,
        ref: 'Champion'
    },

    // Social Media Integration
    socialMedia: {
        whatsappBusiness: String,
        instagram: String,
        facebook: String
    }
}, {
    timestamps: true
});

// Indexes
artisanSchema.index({ phone: 1 });
artisanSchema.index({ cluster: 1 });
artisanSchema.index({ kycStatus: 1 });
artisanSchema.index({ isActive: 1 });

module.exports = mongoose.model('Artisan', artisanSchema);