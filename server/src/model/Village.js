const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Village name"],
    },
    value: {
      type: String,
    },
    label: {
      type: String,
    },
  },
  { timestamps: true }
);

villageSchema.pre("save", function (next) {
  this.value = this.name;
  this.label = this.name;
  next();
});

const Village = mongoose.model("Village", villageSchema);

module.exports = Village;
