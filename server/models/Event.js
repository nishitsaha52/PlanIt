const mongoose = require('mongoose');

// Define the schema for ticket tiers
const ticketTierSchema = new mongoose.Schema({
  tier: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
});

// Define the main Event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  locationType: {
    type: String,
    enum: ['physical', 'virtual'],
    required: true,
  },
  physicalLocation: {
    type: String,
    required: function() {
      return this.locationType === 'physical';
    },
  },
  virtualLink: {
    type: String,
    required: function() {
      return this.locationType === 'virtual';
    },
  },
  ticketTiers: [ticketTierSchema], // Embedded subdocument for ticket tiers
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendee', // Assuming you have an Attendee model
    },
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for organizers
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);
