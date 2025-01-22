const mongoose = require('mongoose');

const upazilaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide an Upazila name'],
        },
        value: {
            type: String, // value ফিল্ড সংজ্ঞায়িত
        },
        label: {
            type: String, // label ফিল্ড সংজ্ঞায়িত
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

// Pre-save middleware: value এবং label ফিল্ড সেট করা
upazilaSchema.pre('save', function (next) {
    this.value = this.name; // value ফিল্ডে name এর মান সেট
    this.label = this.name; // label ফিল্ডে name এর মান সেট
    next();
});

// Upazila মডেল তৈরি
const Upazila = mongoose.model('Upazila', upazilaSchema);

module.exports = Upazila;
