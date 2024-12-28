const mongoose = require('mongoose');
const { mongodb_url } = require('../secret');
require('dotenv').config();

const connectDB = async () => {
    try {
          await mongoose.connect(mongodb_url);
        console.log('Connected to MongoDB database...');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB