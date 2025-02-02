const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  houseNumber: { type: String, required: true }, // Changed to String
  phoneNumber: { type: String, required: true }, // Changed to String
  dateOfEntry: { type: Date, required: true },
  payments: [
    {
      month: String,
      amountPaid: Number,
      balance: Number,
      status: { type: String, enum: ['clear', 'not clear'], default: 'not clear' },
      date: { type: Date, default: Date.now },
    }
  ]
});

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;