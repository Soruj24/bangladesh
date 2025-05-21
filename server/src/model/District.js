const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a District name"],
    },
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    upazilas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upazila",
      },
    ],
  },
  { timestamps: true }
);

districtSchema.pre("save", function (next) {
  this.value = this.name;
  this.label = this.name;
  next();
});

const District = mongoose.model("District", districtSchema);

module.exports = District;
