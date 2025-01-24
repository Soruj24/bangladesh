const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a Village name'],
        },
        value: {
            type: String, // value ফিল্ড সংজ্ঞায়িত
        },
        label: {
            type: String, // label ফিল্ড সংজ্ঞায়িত
        },
    },
    { timestamps: true }
);

// Pre-save middleware: value এবং label ফিল্ড সেট করা
villageSchema.pre('save', function (next) {
    this.value = this.name; // value ফিল্ডে name এর মান সেট
    this.label = this.name; // label ফিল্ডে name এর মান সেট
    next();
});


const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
