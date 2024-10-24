const Event = require('../models/Event');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Fetch event analytics data
exports.getEventAnalytics = async (req, res) => {
  try {
    // Fetch all events created by the organizer (you can modify this to fetch for specific organizers if needed)
    const events = await Event.find().populate('organizer');
    
    // Calculate total tickets sold, total revenue, and tickets breakdown by tier
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let eventCount = events.length;
    
    const tierBreakdown = {};
    
    // Loop through each event and collect payment and tier data
    for (const event of events) {
      // Find all payments for the current event
      const payments = await Payment.find({ eventId: event._id });

      // Calculate tickets sold and revenue for each event
      payments.forEach(payment => {
        totalTicketsSold += payment.numTickets;
        totalRevenue += payment.totalAmount;
        
        // Breakdown by tier
        if (!tierBreakdown[payment.tier]) {
          tierBreakdown[payment.tier] = 0;
        }
        tierBreakdown[payment.tier] += payment.numTickets;
      });
    }

    const analyticsData = {
      totalTicketsSold,
      totalRevenue,
      eventCount,
      tierBreakdown,
    };

    return res.status(200).json(analyticsData);

  } catch (error) {
    console.error('Error fetching event analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch event analytics' });
  }
};
