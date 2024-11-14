// models/Union.js
const mongoose = require('mongoose');

const unionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a Union name'],
    },
    upazila: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upazila',
        required: true,
    },
    villages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
    }],
}, { timestamps: true });

const Union = mongoose.model('Union', unionSchema);

module.exports = Union;
