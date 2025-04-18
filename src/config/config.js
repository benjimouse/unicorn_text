require('dotenv').config();

const PORT = process.env.PORT || 8080;
const API_TOKEN = process.env.API_TOKEN; 
const PRIVATE_KEY_JSON = JSON.parse(process.env.PRIVATE_KEY);

module.exports = {
    PORT,
    API_TOKEN,
    PRIVATE_KEY_JSON,
};
