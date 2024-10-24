const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
      const {
          title,
          description,
          date,
          locationType,
          physicalLocation,
          virtualLink,
          ticketTiers,  // Includes ticket categories like VIP, General Admission
      } = req.body;

      const organizerId = req.user.id; // Assuming middleware sets req.user from the token

      // Create new event object
      const newEvent = new Event({
          title,
          description,
          date,
          locationType,
          physicalLocation: locationType === 'physical' ? physicalLocation : null,  // Set physical location if event is physical
          virtualLink: locationType === 'virtual' ? virtualLink : null,  // Set virtual link if event is virtual
          ticketTiers,  // Array of ticket tiers (e.g., VIP, General Admission)
          organizer: organizerId  // Organizer is set to the current authenticated user
      });

      // Save event to database
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
  } catch (err) {
      console.error('Error creating event:', err);
      res.status(400).json({ error: 'Error creating event' });
  }
};

// Get all events by the organizer
exports.getAllEvents = async (req, res) => {
    try {
        // Fetch events created by the authenticated organizer
        const events = await Event.find({ organizer: req.user.id });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event', error });
    }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  try {
      const { id } = req.params;
      const {
          title,
          description,
          date,
          locationType,
          physicalLocation,
          virtualLink,
          ticketTiers
      } = req.body;

      // Update event
      const updatedEvent = await Event.findByIdAndUpdate(
          id,
          {
              title,
              description,
              date,
              locationType,
              physicalLocation: locationType === 'physical' ? physicalLocation : null,
              virtualLink: locationType === 'virtual' ? virtualLink : null,
              ticketTiers
          },
          { new: true } // Return the updated document
      );

      if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });

      res.json(updatedEvent);
  } catch (err) {
      console.error('Error updating event:', err);
      res.status(400).json({ error: 'Error updating event' });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });

      res.json({ message: 'Event deleted successfully' });
  } catch (err) {
      console.error('Error deleting event:', err);
      res.status(400).json({ error: 'Error deleting event' });
  }
};
