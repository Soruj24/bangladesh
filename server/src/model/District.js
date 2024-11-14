// models/District.js
const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a District name'],
    },
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
        required: true,
    },
    upazilas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upazila',
    }],
}, { timestamps: true });

const District = mongoose.model('District', districtSchema);

module.exports = District;
