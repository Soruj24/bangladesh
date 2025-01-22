const mongoose = require('mongoose');

const upazilaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide an Upazila name'],
        },
        upazilas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Upazila',
            },
        ],
        value: {
            type: String, 
        },
        label: {
            type: String,  
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
            required: true,
        },
        unions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Union',
            },
        ],
    },
    { timestamps: true }
);

upazilaSchema.pre('save', function (next) {
    this.value = this.name; 
    this.label = this.name; 
    next();
});

const Upazila = mongoose.model('Upazila', upazilaSchema);

module.exports = Upazila;
