// models/Upazila.js
const mongoose = require('mongoose');

const upazilaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an Upazila name'],
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true,
    },
    unions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Union',
    }],
}, { timestamps: true });

const Upazila = mongoose.model('Upazila', upazilaSchema);

module.exports = Upazila;
