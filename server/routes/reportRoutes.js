const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route to get event report
router.get('/event-report', reportController.getEventReport);

module.exports = router;
