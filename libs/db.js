const config = require('config');
const mongoose = require('mongoose');

const dbUrl = config.db.url;
mongoose.connect(dbUrl)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(error => {
    console.log(`Unable to connect MongoDB`, error);
  });
