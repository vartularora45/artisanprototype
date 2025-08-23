const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },

    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    artisanId: {
        type: Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },

    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: { type: Number, required: true, min: 1 },
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    }],

    // Pricing
    subtotal: { type: Number, required: true },
    shipping: {
        cost: Number,
        method: String
    },
    total: { type: Number, required: true },

    // Customer
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: String
    },

    // Address
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },

    // Payment
    paymentMode: {
        type: String,
        enum: ['cod', 'upi', 'card', 'netbanking'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Source
    source: {
        channel: {
            type: String,
            enum: ['whatsapp', 'instagram', 'microstore', 'direct'],
            required: true
        }
    }
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ artisanId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
