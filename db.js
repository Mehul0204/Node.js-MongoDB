const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('todolist');
  } catch (e) {
    console.error('Connection error:', e);
    process.exit(1);
  }
}

module.exports = { connect };