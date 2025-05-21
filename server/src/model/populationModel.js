const mongoose = require("mongoose");

// User Schema Definition
const populationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name cannot be longer than 100 characters"], // Fixed max_length to maxlength
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"], // Email format validation
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [
        /^\+?(\d{1,4})?[-.\s]?(\(?\d{1,3}\)?)[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
        "Please provide a valid phone number",
      ], 
    },
    tag: {
      type: String,
      required: [true, "Tag is required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"], // Added a max length
    },
    image: {
      type: String,
      default: "https://img.freepik.com/free-icon/user_318-159711.jpg",
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    upazila: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upazila",
      required: true,
    },
    union: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Union",
      required: true,
    },
    village: { type: mongoose.Schema.Types.ObjectId, ref: "Village" },
  },

  {
    timestamps: true,
  }
);

const Population = mongoose.model("Population", populationSchema);

module.exports = Population;
