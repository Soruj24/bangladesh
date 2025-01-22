const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a District name'],
        },
        value: {
            type: String, // value ফিল্ডের টাইপ String
        },
        label: {
            type: String, // label ফিল্ডের টাইপ String
        },
        division: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Division',
            required: true,
        },
        upazila: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Upazila',
            },
        ],
    },
    { timestamps: true }
);

// Pre-save middleware: value এবং label ফিল্ড সেট করা
districtSchema.pre('save', function (next) {
    this.value = this.name; // value ফিল্ডে name এর মান সেট
    this.label = this.name; // label ফিল্ডে name এর মান সেট
    next();
});

// District মডেল তৈরি
const District = mongoose.model('District', districtSchema);

module.exports = District;
