const jwt = require('jsonwebtoken');
const secretKey = 'asdfghjklqwertyuiopzxcvb'; // Consistent key

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header is missing or not in Bearer format');
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error('Token expired:', err.message);
        return res.status(401).json({ error: 'Token has expired' });
      } else if (err.name === 'JsonWebTokenError') {
        console.error('Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ error: 'Token verification failed' });
      }
    }

    console.log('Token decoded:', decoded);
    req.user = decoded;
    next();
  });
};
