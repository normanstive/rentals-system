const mongoose = require('mongoose');  // Add this line to import mongoose

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  dateOfEntry: { type: Date, required: true },
  payments: [
    {
      month: String,
      amountPaid: Number,
      balance: Number,
      status: { type: String, enum: ['clear', 'not clear'], default: 'not clear' },
      date: Date,
    }
  ]
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;  // Export the Tenant model


