
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords

// User Schema Definition
const populationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      max_length: [100, 'Name cannot be longer than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'], // Email format validation
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^\+?(\d{1,4})?[-.\s]?(\(?\d{1,3}\)?)[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'Please provide a valid phone number'], // Phone format validation
    },
    tag: {
      type: String,
      required: [true, 'Tag is required']
    },
    image: {
      type: String,
      default: 'https://img.freepik.com/free-icon/user_318-159711.jpg',
    },
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
    district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
    upazila: { type: mongoose.Schema.Types.ObjectId, ref: 'Upazila', required: true },
    union: { type: mongoose.Schema.Types.ObjectId, ref: 'Union', required: true },
    village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Password Hashing Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new or modified

  // Hash the password with bcrypt
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error); // Handle errors during hashing
  }
});

// Password Comparison Method
userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare password with hashed version
  } catch (error) {
    throw new Error('Password comparison failed'); // Error handling
  }
};

// Create a User Model from the Schema
const Population = mongoose.model('Population', populationSchema);

module.exports = Population;
