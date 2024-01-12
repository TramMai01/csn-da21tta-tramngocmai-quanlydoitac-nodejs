const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = 9999;
mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/partnersdb', { useUnifiedTopology: true, useNewUrlParser: true });

const partnerSchema = new mongoose.Schema({
  partnerType: {
    type: String,
    required: true,
    enum: ['individual', 'organization'],
  },
  individualData: {
    fullName: String,
    title: String,
    email: { type: String, lowercase: true, trim: true },
    address: String,
    startDate: Date,
    phone: String,
    activity: String,
  },
  organizationData: {
    organizationName: String,
    representative: String,
    title: String,
    address: String,
    email: { type: String, lowercase: true, trim: true },
    startDate: Date,
    phone: String,
    activity: String,
  },
});

const Partner = mongoose.model('Partner', partnerSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/partners/manage', async (req, res) => {
  try {
    const partners = await Partner.find();
    res.render('manage', { partners });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/partners/view/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    res.render('view', { partner, partnerId: req.params.id }); // Pass partnerId to the view
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.get('/partners/edit/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    res.render('edit', { partner });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/partners/:id', async (req, res) => {
  try {
    console.log('Received update request:', req.body);

    const { partnerType, ...updateData } = req.body;

    let updatedPartner;

    if (partnerType === 'individual') {
      console.log('Updating individual partner with data:', updateData);

      updatedPartner = await Partner.findByIdAndUpdate(
        req.params.id,
        { $set: { partnerType, individualData: { ...updateData } } },
        { new: true }
      );

    } else if (partnerType === 'organization') {
      console.log('Updating organization partner with data:', updateData);

      updatedPartner = await Partner.findByIdAndUpdate(
        req.params.id,
        { $set: { partnerType, organizationData: { ...updateData } } },
        { new: true }
      );

    } else {
      return res.status(400).json({ error: 'Invalid partnerType' });
    }

    console.log('Updated partner:', updatedPartner);

    const redirectPath = req.query.redirect || '/partners/manage';

    res.redirect(redirectPath);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/partners', async (req, res) => {
  try {
    console.log('Received data from form:', req.body);

    const { partnerType } = req.body;

    let savedPartner;

    if (partnerType === 'individual') {
      const newIndividual = new Partner({
        partnerType: 'individual',
        individualData: { ...req.body },
      });

      savedPartner = await newIndividual.save();
    } else if (partnerType === 'organization') {
      const newOrganization = new Partner({
        partnerType: 'organization',
        organizationData: { ...req.body },
      });

      savedPartner = await newOrganization.save();
    } else {
      return res.status(400).json({ error: 'Invalid partnerType' });
    }

    // Respond with a JSON indicating success and the saved partner data
    res.status(201).json({ success: true, partner: savedPartner });
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/partners/:id', async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
