const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    artisanId: {
        type: Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },

    // Basic Product Info
    title: {
        type: Map,
        of: String,
        required: true
    },
    description: {
        type: Map,
        of: String,
        required: true
    },

    // Media
    images: [{
        url: String,
        altText: String,
        isMain: { type: Boolean, default: false },
        processedImages: {
            thumbnail: String,
            medium: String,
            large: String,
            backgroundRemoved: String
        }
    }],
    storyCard: {
        videoUrl: String,
        thumbnailUrl: String,
        captions: {
            type: Map,
            of: String
        }
    },

    // Voice Input Data
    originalVoiceNote: {
        audioFile: String,
        language: String,
        transcription: {
            type: Map,
            of: String
        },
        confidenceScore: { type: Number, min: 0, max: 1 }
    },

    // Product Attributes
    category: {
        type: String,
        required: true,
        enum: ['textiles', 'jewelry', 'pottery', 'woodwork', 'metalwork', 'leather', 'home_decor', 'bags', 'clothing', 'other']
    },
    subcategory: String,
    tags: [String],
    materials: [String],
    techniques: [String],
    colors: [String],
    motifs: [String],

    // Variants
    variants: [{
        name: String,
        type: {
            type: String,
            enum: ['size', 'color', 'material', 'design']
        },
        priceAdjustment: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        sku: String
    }],

    // Pricing
    pricing: {
        retail: { type: Number, required: true },
        wholesale: Number,
        cod: Number,
        currency: { type: String, default: 'INR' }
    },

    // Inventory
    stock: {
        available: { type: Number, default: 0 },
        reserved: { type: Number, default: 0 },
        lowStockThreshold: { type: Number, default: 5 }
    },

    // Distribution Channels
    channels: {
        whatsapp: {
            enabled: { type: Boolean, default: true },
            catalogId: String,
            lastSync: Date
        },
        microstore: {
            enabled: { type: Boolean, default: true },
            slug: String
        }
    },

    // SEO
    seo: {
        slug: { type: String, unique: true },
        metaTitle: {
            type: Map,
            of: String
        }
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'out_of_stock'],
        default: 'draft'
    },
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },

    // AI Confidence
    aiConfidence: {
        overall: { type: Number, min: 0, max: 1 },
        title: { type: Number, min: 0, max: 1 },
        description: { type: Number, min: 0, max: 1 }
    }
}, {
    timestamps: true
});

// Indexes
productSchema.index({ artisanId: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);