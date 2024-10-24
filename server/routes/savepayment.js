const express = require('express');
const router = express.Router();
const { savePaymentDetails } = require('../controllers/savePaymentController');

// POST route to save payment details
router.post('/save', savePaymentDetails);

module.exports = router;
