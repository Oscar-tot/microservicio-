const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const catalogRoutes = require('./routes/catalog');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/catalog', catalogRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Catalog service running on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});
