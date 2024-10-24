const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authentication middleware
router.use(authMiddleware);

// Route to create a new project
router.post('/', eventController.createEvent);

// Route to get all projects
router.get('/', eventController.getAllEvents);

// Route to get a project by ID
router.get('/:id', eventController.getEventById);

// Route to update a project by ID
router.put('/:id', eventController.updateEvent);

// Route to delete a project by ID
router.delete('/:id', eventController.deleteEvent);

module.exports = router;