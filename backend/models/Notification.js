const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    // Recipient Information
    recipientType: {
        type: String,
        enum: ['artisan', 'buyer', 'champion', 'admin'],
        required: true
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    recipientPhone: String, // For SMS/WhatsApp
    recipientEmail: String, // For email notifications

    // Content
    title: { type: String, required: true },
    message: { type: String, required: true },
    shortMessage: String, // For SMS (160 chars max)

    // Multilingual Content
    content: {
        type: Map,
        of: {
            title: String,
            message: String,
            shortMessage: String
        }
    },

    // Notification Type & Category
    type: {
        type: String,
        enum: [
            'order_received', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled',
            'payment_received', 'payment_pending', 'payment_failed',
            'new_message', 'new_inquiry', 'new_review',
            'stock_low', 'stock_out',
            'kyc_approved', 'kyc_rejected', 'kyc_pending',
            'promotion', 'festival_campaign', 'new_feature',
            'system_maintenance', 'security_alert',
            'reminder', 'follow_up'
        ],
        required: true
    },
    category: {
        type: String,
        enum: ['transactional', 'promotional', 'system', 'reminder'],
        required: true
    },

    // Priority & Scheduling
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    scheduledFor: Date, // For scheduled notifications
    expiresAt: Date, // When notification becomes irrelevant

    // Delivery Channels
    channels: [{
        type: {
            type: String,
            enum: ['push', 'sms', 'whatsapp', 'email', 'in_app'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'delivered', 'failed', 'skipped'],
            default: 'pending'
        },
        sentAt: Date,
        deliveredAt: Date,
        failureReason: String,
        externalId: String, // Provider-specific message ID
        cost: Number, // SMS/WhatsApp cost in paisa

        // Channel-specific data
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }],

    // Interaction Tracking
    isRead: { type: Boolean, default: false },
    readAt: Date,
    clickedAt: Date,
    actionTaken: {
        type: String,
        enum: ['dismissed', 'clicked', 'replied', 'shared']
    },

    // Related Entity
    relatedEntity: {
        type: String,
        enum: ['order', 'product', 'payment', 'conversation', 'artisan', 'buyer']
    },
    relatedEntityId: Schema.Types.ObjectId,

    // Action Buttons/Links
    actions: [{
        label: String,
        type: {
            type: String,
            enum: ['url', 'deeplink', 'phone', 'whatsapp']
        },
        value: String, // URL, phone number, etc.
        primary: { type: Boolean, default: false }
    }],

    // Personalization
    personalizationData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },

    // Batch Information (for bulk notifications)
    batchId: String,
    batchSize: Number,
    batchIndex: Number,

    // A/B Testing
    variant: String, // A/B test variant
    testGroup: String,

    // Compliance
    consentRequired: { type: Boolean, default: false },
    consentGiven: { type: Boolean, default: false },
    unsubscribeUrl: String,

    // Retry Logic
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    nextRetryAt: Date,

    // Performance Metrics
    openRate: Number, // For email
    clickRate: Number,
    conversionRate: Number,

    // Status
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Indexes
notificationSchema.index({ recipientType: 1, recipientId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ batchId: 1 });
notificationSchema.index({ priority: -1, createdAt: 1 });
notificationSchema.index({ 'channels.status': 1 });

module.exports = mongoose.model('Notification', notificationSchema);