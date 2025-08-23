const mongoose = require('mongoose');
const { Schema } = mongoose;

const analyticsSchema = new Schema({
    // Reference
    entityType: {
        type: String,
        enum: ['product', 'artisan', 'order', 'channel', 'campaign'],
        required: true
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    // Time Dimension
    date: { type: Date, required: true },
    hour: Number, // 0-23 for hourly analytics
    dayOfWeek: Number, // 0-6 (0 = Sunday)
    week: Number, // Week number
    month: Number, // 1-12
    year: Number,

    // Core Metrics
    metrics: {
        // Traffic Metrics
        views: { type: Number, default: 0 },
        uniqueViews: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },

        // Engagement Metrics
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },

        // Conversion Metrics
        leads: { type: Number, default: 0 },
        inquiries: { type: Number, default: 0 },
        orders: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },

        // Performance Metrics
        conversionRate: { type: Number, default: 0 }, // orders/views
        averageOrderValue: { type: Number, default: 0 },
        bounceRate: { type: Number, default: 0 },
        timeOnPage: { type: Number, default: 0 }, // seconds

        // Channel Specific
        whatsappMessages: { type: Number, default: 0 },
        whatsappReplies: { type: Number, default: 0 },
        catalogViews: { type: Number, default: 0 },
        storyViews: { type: Number, default: 0 }
    },

    // Dimensions
    channel: {
        type: String,
        enum: ['whatsapp', 'instagram', 'facebook', 'microstore', 'etsy', 'amazon', 'direct', 'organic']
    },
    source: String, // UTM source or referrer
    medium: String, // UTM medium
    campaign: String, // UTM campaign

    // Geographic Data
    geography: {
        country: String,
        state: String,
        city: String,
        pincode: String
    },

    // Device & User Agent
    device: {
        type: {
            type: String,
            enum: ['mobile', 'desktop', 'tablet']
        },
        os: String,
        browser: String
    },

    // Custom Dimensions
    customDimensions: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Compound Indexes for efficient queries
analyticsSchema.index({ entityType: 1, entityId: 1, date: -1 });
analyticsSchema.index({ date: -1, channel: 1 });
analyticsSchema.index({ entityType: 1, date: -1 });
analyticsSchema.index({ channel: 1, date: -1 });
analyticsSchema.index({ year: 1, month: 1, entityType: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);