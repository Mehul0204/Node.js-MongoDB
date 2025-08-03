const mongoose = require('mongoose');

const dbConfig = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

module.exports = {
  mongoose,
  dbConfig,
};
