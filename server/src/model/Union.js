const mongoose = require('mongoose');

const unionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a Union name'],
        },
        value: {
            type: String, // value ফিল্ড সংজ্ঞায়িত
        },
        label: {
            type: String, // label ফিল্ড সংজ্ঞায়িত
        },
        upazila: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Upazila',
            required: true,
        },
        villages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Village',
            },
        ],
    },
    { timestamps: true }
);

// Pre-save middleware: value এবং label ফিল্ড সেট করা
unionSchema.pre('save', function (next) {
    this.value = this.name; // value ফিল্ডে name এর মান সেট
    this.label = this.name; // label ফিল্ডে name এর মান সেট
    next();
});

// Union মডেল তৈরি
const Union = mongoose.model('Union', unionSchema);

module.exports = Union;
