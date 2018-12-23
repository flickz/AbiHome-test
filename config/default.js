require('dotenv');

const port = process.env.PORT || 3000;

module.exports = {
  port: port,
  host: 'localhost:' + port,
  db: {
    url: process.env.MONGO_URL || 'localhost:27017/abihometest'
  }
};
