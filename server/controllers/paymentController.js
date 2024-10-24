const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Event = require('../models/Event');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: 'rzp_test_1d4o2Z5qRsE8v2',
    key_secret: 'P4mtLvjvbUgtBRKSxNI15R2F'
});

exports.createOrder = async (req, res) => {
    try {
        const { eventId, numberOfTickets } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const totalAmount = event.pricePerTicket * numberOfTickets * 100; // Convert to paise

        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `receipt_order_${eventId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, orderId: order.id, amount: totalAmount, currency: "INR" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', razorpay.key_secret)
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const payment = await Payment.create({
            eventId: req.body.eventId,
            userId: req.user._id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount: req.body.amount
        });
        res.status(200).json({ success: true, payment });
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
};
