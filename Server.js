const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const Tenant = require('./models/Tenant');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://normanstive:@STEPhen123@cluster0.nwo89.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));

const updateSpreadsheet = async () => {
  try {
    const tenants = await Tenant.find();
    const data = tenants.map(tenant => ({
      Name: tenant.name,
      HouseNumber: tenant.houseNumber,
      ...tenant.payments.reduce((acc, payment) => {
        acc[`${payment.month} AmountPaid`] = payment.amountPaid;
        acc[`${payment.month} Balance`] = payment.balance;
        acc[`${payment.month} Status`] = payment.status;
        acc[`${payment.month} Date`] = new Date(payment.date).toLocaleDateString();
        return acc;
      }, {})
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Tenants");
    xlsx.writeFile(workbook, 'tenants.xlsx');
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
  }
};

app.get('/tenants', async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

app.post('/tenants', async (req, res) => {
  try {
    const newTenant = new Tenant(req.body);
    await newTenant.save();
    await updateSpreadsheet();
    res.status(201).json(newTenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

app.put('/tenants/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    
    tenant.payments.push(req.body);
    await tenant.save();
    await updateSpreadsheet();
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});