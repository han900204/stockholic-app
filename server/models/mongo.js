const mongoose = require('mongoose');

/**
 * Load .env file
 */
if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv');
  dotenv.config();
}

/**
 * Connect to Mongo DB
 */
const MONGO_URI = process.env.MONGO_URI;

const connectMongo = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'stockholic-chat',
    })
    .then(() => console.log('Connected to Mongo DB.'))
    .catch((err) => console.log(err));
};

module.exports = connectMongo;
