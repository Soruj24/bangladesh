const mongoose = require("mongoose");

const unionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Union name"],
    },
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    upazila: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upazila",
      required: true,
    },
    villages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Village",
      },
    ],
  },
  { timestamps: true }
);

unionSchema.pre("save", function (next) {
  this.value = this.name;
  this.label = this.name;
  next();
});

const Union = mongoose.model("Union", unionSchema);

module.exports = Union;
