const { cloud_name, cloud_api_key, cloud_api_secret } = require('../secret');

const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: cloud_api_key, 
    api_secret: cloud_api_secret 
});

module.exports = cloudinary