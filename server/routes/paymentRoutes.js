const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PzLD9P1w7kV6TvJ8gPHbvzHEtBTovBdkF1G5wBuuAPHp12DugBMH8ERfkFFE77jwRZ4VcA4yj3yUdHjAu90liRH00B787fqJ6'); // Replace with your Stripe Secret Key
const Event = require('../models/Event'); // Import the Event model

router.post('/create-checkout-session', async (req, res) => {
    const { totalAmount, tier, numTickets, name, email, phone, eventId } = req.body;

    if (!totalAmount || !tier || !numTickets || !name || !email || !phone || !eventId) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Tier: ${tier}`,
                        },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: numTickets,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}&numTickets=${numTickets}&totalAmount=${totalAmount}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&eventId=${eventId}`,
            cancel_url: 'http://localhost:3000/cancel',
            metadata: {
                name,
                email,
                phone,
                eventId // Optionally include eventId in metadata
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error); // Log error details
        res.status(500).send('Failed to create checkout session.');
    }
    console.log('Received data:', { totalAmount, tier, numTickets, name, email, phone, eventId });
});


module.exports = router;
