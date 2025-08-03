require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
};

mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
 