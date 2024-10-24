const PaymentDetails = require('../models/PaymentDetails');
const Event = require('../models/Event');

// Function to get total tickets sold and revenue generated per event and tier
exports.getEventReport = async (req, res) => {
    try {
        const report = await PaymentDetails.aggregate([
            // Group by event and tier to get total tickets and revenue per tier
            {
                $group: {
                    _id: { eventId: "$eventId", tier: "$tier" },
                    totalTickets: { $sum: "$numTickets" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            // Lookup event details from the Event collection
            {
                $lookup: {
                    from: 'events',
                    localField: '_id.eventId',
                    foreignField: '_id',
                    as: 'event'
                }
            },
            // Unwind the event data to get a single event object
            {
                $unwind: "$event"
            },
            // Project the necessary fields (event name, tier, total tickets, total revenue)
            {
                $project: {
                    eventName: "$event.name",
                    tier: "$_id.tier",
                    totalTickets: 1,
                    totalRevenue: 1
                }
            },
            // Sort by event name and tier (optional)
            {
                $sort: { "eventName": 1, "tier": 1 }
            }
        ]);

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
