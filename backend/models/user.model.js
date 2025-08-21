import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Profile Information
  profile: {
    avatar: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    occupation: String,
    bio: {
      type: String,
      maxLength: 200
    }
  },

  // Contact Preferences
  communication: {
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati', 'bengali', 'tamil', 'kannada', 'telugu', 'marathi'],
      default: 'english'
    },
    preferredChannel: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'push'],
      default: 'email'
    },
    notifications: {
      orderUpdates: {
        type: Boolean,
        default: true
      },
      promotions: {
        type: Boolean,
        default: true
      },
      newProducts: {
        type: Boolean,
        default: false
      },
      priceDrops: {
        type: Boolean,
        default: false
      }
    }
  },

  // Addresses
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: String, // Address label like "Home", "Office"
    street: {
      type: String,
      required: true
    },
    locality: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmark: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Shopping Preferences
  preferences: {
    categories: [{
      type: String,
      enum: ['textiles', 'jewelry', 'pottery', 'metalwork', 'woodwork', 'paintings', 'home-decor', 'accessories']
    }],
    priceRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 10000
      }
    },
    preferredArtisanTypes: [{
      type: String,
      enum: ['verified', 'premium', 'local', 'eco-friendly']
    }],
    craftClusters: [{
      type: String,
      enum: ['jaipur-block-print', 'kutch-embroidery', 'moradabad-brass', 'other']
    }],
    paymentMethods: [{
      type: String,
      enum: ['cod', 'upi', 'card', 'wallet', 'netbanking']
    }],
    deliveryPreference: {
      type: String,
      enum: ['standard', 'express', 'scheduled'],
      default: 'standard'
    }
  },

  // Wishlist & Favorites
  wishlist: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    priceWhenAdded: Number,
    notifyOnPriceChange: {
      type: Boolean,
      default: false
    }
  }],

  favoriteArtisans: [{
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Purchase History & Analytics
  purchaseHistory: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    favoriteCategory: String,
    lastPurchaseDate: Date,
    firstPurchaseDate: Date
  },

  // Loyalty & Rewards
  loyalty: {
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    joinedProgram: {
      type: Date,
      default: Date.now
    }
  },

  // Reviews & Ratings
  reviewStats: {
    totalReviews: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    helpfulVotes: {
      type: Number,
      default: 0
    }
  },

  // Social Features
  social: {
    referralCode: {
      type: String,
      unique: true
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    totalReferrals: {
      type: Number,
      default: 0
    },
    shareableProfile: {
      type: Boolean,
      default: false
    }
  },

  // Account Status & Security
  account: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active'
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    kycStatus: {
      type: String,
      enum: ['not-required', 'pending', 'verified', 'rejected'],
      default: 'not-required'
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    }
  },

  // Cart (for session management)
  cart: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: Number,
    customization: {
      isCustom: {
        type: Boolean,
        default: false
      },
      specifications: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Recently Viewed
  recentlyViewed: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Search History
  searchHistory: [{
    query: String,
    searchedAt: {
      type: Date,
      default: Date.now
    },
    resultsCount: Number
  }],

  // Device & Session Info
  deviceInfo: [{
    deviceId: String,
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop']
    },
    platform: String, // iOS, Android, Web
    appVersion: String,
    lastUsed: Date,
    pushToken: String // for notifications
  }]

}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'social.referralCode': 1 });
userSchema.index({ 'account.status': 1 });
userSchema.index({ 'preferences.categories': 1 });
userSchema.index({ 'addresses.pincode': 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to generate referral code
userSchema.pre('save', async function(next) {
  if (!this.social.referralCode) {
    this.social.referralCode = generateReferralCode(this.name);
  }
  next();
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for default address
userSchema.virtual('defaultAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Method to add to wishlist
userSchema.methods.addToWishlist = function(productId, price) {
  const existingItem = this.wishlist.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (!existingItem) {
    this.wishlist.push({
      productId,
      priceWhenAdded: price,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Method to add to cart
userSchema.methods.addToCart = function(item) {
  const existingItem = this.cart.find(cartItem => 
    cartItem.productId.toString() === item.productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
    existingItem.addedAt = new Date();
  } else {
    this.cart.push({
      ...item,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to update cart item quantity
userSchema.methods.updateCartQuantity = function(productId, quantity) {
  const item = this.cart.find(cartItem => 
    cartItem.productId.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.cart = this.cart.filter(cartItem => 
        cartItem.productId.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Method to add to recently viewed
userSchema.methods.addToRecentlyViewed = function(productId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  
  // Add to beginning
  this.recentlyViewed.unshift({
    productId,
    viewedAt: new Date()
  });
  
  // Keep only last 50 items
  this.recentlyViewed = this.recentlyViewed.slice(0, 50);
  
  return this.save();
};

// Method to update loyalty points
userSchema.methods.addLoyaltyPoints = function(points) {
  this.loyalty.points += points;
  
  // Update tier based on points
  const { points: currentPoints } = this.loyalty;
  
  if (currentPoints >= 10000) {
    this.loyalty.tier = 'platinum';
  } else if (currentPoints >= 5000) {
    this.loyalty.tier = 'gold';
  } else if (currentPoints >= 1000) {
    this.loyalty.tier = 'silver';
  }
  
  return this.save();
};

// Helper function to generate referral code
const generateReferralCode = (name) => {
  const nameCode = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
  const randomCode = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `${nameCode}${randomCode}`;
};

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
