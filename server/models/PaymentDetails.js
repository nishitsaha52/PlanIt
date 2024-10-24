const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payment Schema
const paymentSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    tier: { type: String, required: true },
    numTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to Event collection
    createdAt: { type: Date, default: Date.now }
});

// Export the PaymentDetails model
module.exports = mongoose.model('PaymentDetails', paymentSchema);
