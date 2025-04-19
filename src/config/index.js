require('dotenv').config();
module.exports = {
    PRIVATE_KEY_JSON: JSON.parse(process.env.PRIVATE_KEY),
    PORT: process.env.PORT || 8080,
    ALLOWED_USERS: process.env.ALLOWED_USERS ? process.env.ALLOWED_USERS.split(',') : [],
    API_TOKEN: process.env.API_TOKEN || 'test-token',
  };
  