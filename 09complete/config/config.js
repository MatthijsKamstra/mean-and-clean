// Copy this file as config.js in the same folder, with the proper database connection URI.

module.exports = {
  // user set variables
  port : process.env.API_PORT || process.env.PORT || 8000,
  mongoURL : process.env.MONGO_URL || 'mongodb://localhost:27017',
  mongoUser : process.env.MONGO_USER || '',
  mongoPass : process.env.MONGO_PASS || '',
  mongoDBName : process.env.MONGO_DB_NAME || 'mck',
};
