const jwt = require('jsonwebtoken');
const Member = require('../models/Member'); // Adjust the path to your Member model if needed

const JWT_SECRET = 'asdfghjklqwertyuiopzxcvb'; // Replace this with your actual secret key

// Middleware to check user roles
const roleMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Extract token from Authorization header
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            // Verify and decode the token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Find member by ID
            const member = await Member.findById(decoded.userId);
            if (!member) {
                return res.status(401).json({ error: 'Member not found' });
            }

            // Check if the member's role is one of the allowed roles
            if (!allowedRoles.includes(member.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Add member information to request object
            req.member = member;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = roleMiddleware;
