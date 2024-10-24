// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dhjeamjji', 
        api_key: '457758754731667', 
        api_secret: 'LFzGoRRkktsnnmNYvrbbvIC7XM4' // Click 'View API Keys' above to copy your API secret
    });

module.exports = cloudinary;
