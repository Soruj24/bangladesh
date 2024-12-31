// models/Village.js
const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a Village name'],
    },
  
}, { timestamps: true });

const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
