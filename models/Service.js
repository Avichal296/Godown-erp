const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  category:    String,

  // Vendor se connected
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },

  // Pricing model
  pricingModel: {
    type: String,
    enum: ['fixed', 'hourly', 'per_unit', 'subscription'],
    default: 'fixed'
  },
  price: { type: Number, required: true },
  unit:  String, // "hour", "month", "per delivery"

  availability: {
    type: String,
    enum: ['available', 'unavailable', 'limited'],
    default: 'available'
  },

  // Stats
  totalOrders: { type: Number, default: 0 },
  revenue:     { type: Number, default: 0 },

  isActive:  { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);