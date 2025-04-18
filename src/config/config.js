require('dotenv').config();

const PORT = process.env.PORT || 8080;
const PWORD = process.env.PWORD;
const PRIVATE_KEY_JSON = JSON.parse(process.env.PRIVATE_KEY);

module.exports = {
    PORT,
    PWORD,
    PRIVATE_KEY_JSON,
};
