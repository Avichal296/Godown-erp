const mongoose = require('mongoose');

// Purchase history ka structure
const PurchaseSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,  // naam bhi save karo - product delete ho jaaye toh bhi dikhega
  quantity:    Number,
  amount:      Number,
  date:        { type: Date, default: Date.now }
});

const ConsumerSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  phone:   String,
  address: String,

  // AI dega yeh segment
  segment: {
    type: String,
    enum: ['new', 'regular', 'high_value', 'at_risk', 'churned'],
    default: 'new'
  },
  segmentInsight: String, // AI ki explanation

  // Purchase history
  purchaseHistory: [PurchaseSchema],

  // Stats - manually update honge
  totalSpend:    { type: Number, default: 0 },
  totalOrders:   { type: Number, default: 0 },
  lastOrderDate: Date,

  isActive:  { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Consumer', ConsumerSchema);