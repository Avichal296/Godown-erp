const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  sku:      { type: String, required: true, unique: true, uppercase: true },
  description: String,
  category: String,
  
  
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  
  
  costPrice:    { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  
  
  stock:             { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  
  
  totalSold:       { type: Number, default: 0 },
  avgMonthlySales: { type: Number, default: 0 },
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);