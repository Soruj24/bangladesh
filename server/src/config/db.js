const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/division-db-soruj-project');
        console.log('Connected to MongoDB database...');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB