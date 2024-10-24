const PaymentDetails = require('../models/PaymentDetails');
const Event = require('../models/Event');  // Import the Event model
const nodemailer = require('nodemailer');

// Configure Nodemailer transport for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use Gmail service
    auth: {
        user: 'goadocs2022@gmail.com',  // Your Gmail address
        pass: 'ezsj jovl etde jsvw',     // Your Gmail app password (not your Gmail account password)
    },
});

// Controller function to save payment details and send confirmation and invitation emails
const savePaymentDetails = async (req, res) => {
    try {
        const { sessionId, tier, numTickets, totalAmount, name, email, phone, eventId } = req.body;

        // Fetch the event by ID to ensure it exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Create a new PaymentDetails document with eventId included
        const payment = new PaymentDetails({
            sessionId,
            tier,
            numTickets,
            totalAmount,
            name,
            email,
            phone,
            eventId: event._id  // Use the fetched event ID
        });

        // Save the payment to the database
        await payment.save();

        // Prepare email options for payment confirmation
        let mailOptions = {
            from: '"Event Management Team" <goadocs2022@gmail.com>', // sender address
            to: email,  // Receiver email from the request body
            subject: 'Payment Confirmation', // Subject line
            text: `Dear ${name},\n\nThank you for your payment of $${totalAmount} for ${numTickets} tickets (Tier: ${tier}).\n\nWe have successfully received your payment for the event: ${event.title}.\n\nBest regards,\nEvent Management Team`, // plain text body
            html: `<b>Dear ${name},</b><br><br>Thank you for your payment of <b>$${totalAmount}</b> for <b>${numTickets}</b> tickets (Tier: <b>${tier}</b>).<br><br>We have successfully received your payment for the event: <b>${event.title}</b>.<br><br>Best regards,<br>Event Management Team` // HTML body
        };

        // Send the confirmation email
        let confirmationInfo = await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent: %s", confirmationInfo.messageId);

        // Prepare email options for invitation
        let invitationMailOptions = {
            from: '"Event Management Team" <your-email@gmail.com>', // sender address
            to: email,  // Only the email address from the request body
            subject: 'Event Invitation',  // Invitation subject line
            text: `Dear attendee,\n\nYou are invited to the event: ${event.title}. Don't miss out on this opportunity!\n\nBest regards,\nEvent Management Team`, // plain text body
            html: `<b>Dear attendee,</b><br><br>You are invited to the event: <b>${event.title}</b>. Don't miss out on this opportunity!<br><br>Best regards,<br>Event Management Team` // HTML body
        };

        // Send the invitation email
        let invitationInfo = await transporter.sendMail(invitationMailOptions);
        console.log("Invitation email sent: %s", invitationInfo.messageId);

        // Return success response
        return res.status(200).json({ message: 'Payment details saved, confirmation and invitation email sent successfully!' });

    } catch (error) {
        console.error('Error saving payment details or sending emails:', error);
        res.status(500).json({ message: 'Failed to save payment details or send emails' });
    }
};

module.exports = {
    savePaymentDetails
};
