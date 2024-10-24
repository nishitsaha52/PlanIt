// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    eventId: { type: String }, // Adjust based on your event structure
    totalTickets: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
