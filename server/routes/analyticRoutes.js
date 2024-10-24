const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Route to get analytics
router.get('/analytics', analyticsController.getEventAnalytics);

module.exports = router;
