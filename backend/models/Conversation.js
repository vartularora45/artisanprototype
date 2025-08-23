const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    // Participants
    buyerPhone: { type: String, required: true },
    buyerName: String,
    artisanId: {
        type: Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },

    // Channel Information
    platform: {
        type: String,
        enum: ['whatsapp', 'instagram', 'facebook', 'telegram', 'sms'],
        default: 'whatsapp'
    },
    channelId: String, // Platform-specific conversation ID

    // Messages
    messages: [{
        messageId: String, // Platform-specific message ID
        sender: {
            type: String,
            enum: ['buyer', 'artisan', 'system', 'ai_assistant'],
            required: true
        },
        content: String,
        messageType: {
            type: String,
            enum: ['text', 'image', 'audio', 'video', 'document', 'location', 'product_catalog', 'sticker', 'reaction'],
            default: 'text'
        },
        timestamp: { type: Date, default: Date.now },

        // AI Assistant Related
        isAiGenerated: { type: Boolean, default: false },
        aiConfidence: { type: Number, min: 0, max: 1 },
        aiModel: String, // Which AI model generated this
        humanApproved: Boolean, // Did human approve AI response

        // Media Information
        media: {
            url: String,
            thumbnail: String,
            mimeType: String,
            size: Number,
            caption: String
        },

        // Message Status
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read', 'failed'],
            default: 'sent'
        },
        deliveredAt: Date,
        readAt: Date,

        // Reply Context
        replyTo: String, // ID of message being replied to
        mentions: [String], // Phone numbers mentioned in message

        // Metadata
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }],

    // Lead Tracking
    leadSource: {
        type: String,
        enum: ['product_view', 'story_card', 'catalog_share', 'referral', 'search', 'advertisement']
    },
    leadScore: { type: Number, default: 0, min: 0, max: 100 },

    // Product Interest
    productInterest: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        interestLevel: {
            type: String,
            enum: ['viewed', 'inquired', 'quoted', 'negotiating']
        },
        timestamp: { type: Date, default: Date.now },
        priceQuoted: Number,
        quantity: Number
    }],

    // Order Generation
    ordersGenerated: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    totalOrderValue: { type: Number, default: 0 },

    // Conversation Status
    status: {
        type: String,
        enum: ['active', 'converted', 'closed', 'spam', 'blocked'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Automation
    autoReplyEnabled: { type: Boolean, default: true },
    lastAutoReply: Date,
    autoReplyCount: { type: Number, default: 0 },

    // Tags and Labels
    tags: [String], // Custom tags for organization
    labels: [{
        name: String,
        color: String,
        addedBy: String,
        addedAt: { type: Date, default: Date.now }
    }],

    // Response Time Tracking
    avgResponseTime: { type: Number, default: 0 }, // in minutes
    pendingResponse: {
        from: {
            type: String,
            enum: ['buyer', 'artisan']
        },
        since: Date
    },

    // Language Detection
    detectedLanguage: String,
    translationNeeded: { type: Boolean, default: false },

    // Privacy and Compliance
    consentGiven: { type: Boolean, default: false },
    dataRetentionExpiry: Date,

    // Notes (for human agents)
    notes: [{
        content: String,
        addedBy: String, // Champion/Agent ID
        addedAt: { type: Date, default: Date.now },
        isPrivate: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

// Indexes
conversationSchema.index({ buyerPhone: 1, artisanId: 1 });
conversationSchema.index({ artisanId: 1, createdAt: -1 });
conversationSchema.index({ status: 1, priority: -1 });
conversationSchema.index({ platform: 1, status: 1 });
conversationSchema.index({ 'pendingResponse.since': 1 });
conversationSchema.index({ leadScore: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
