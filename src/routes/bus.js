const express = require('express');
const router = express.Router();
const { allowOAuthOnly } = require('middlewares/auth');
const { busHandler } = require('services/bus');

router.post('/', allowOAuthOnly, busHandler);

module.exports = router;
