const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
    },
    label: {
        type: String,
    },
    districts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
        },
    ],
});

// Middleware to set `value` and `label` to the value of `name` before saving
divisionSchema.pre('save', function (next) {
    this.value = this.name;
    this.label = this.name;
    next();
});

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
