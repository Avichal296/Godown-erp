const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, unique: true }, // PO-00001, PO-00002

  // Kis vendor se order hai
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  // Order items
  items: [{
    product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,  // copy rakho
    quantity:    { type: Number, required: true },
    unitPrice:   { type: Number, required: true },
    total:       Number   // quantity * unitPrice
  }],

  // ERP Workflow - yahi sabse important hai
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'fulfilled', 'cancelled'],
    default: 'draft'
  },

  totalAmount: { type: Number, default: 0 },
  notes:       String,

  // Kisne banaya
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Kisne approve kiya
  approvedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt:      Date,
  rejectionReason: String,
  fulfilledAt:     Date,

}, { timestamps: true });
// Save se pehle automatic PO number banao
PurchaseOrderSchema.pre('save', async function(next) {
  if (!this.poNumber) {
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.poNumber = `PO-${String(count + 1).padStart(5, '0')}`;
    // PO-00001, PO-00002, PO-00003...
  }

  // Har item ka total calculate karo
  this.items = this.items.map(item => ({
    ...item.toObject(),
    total: item.quantity * item.unitPrice
  }));

  // Poora order total calculate karo
  this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);

  next();
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);