const { body } = require("express-validator");
const User = require("../model/userModel");

// Common password validation pattern
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

// Common validations
const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ min: 3, max: 20 })
  .withMessage("Name must be between 3-20 characters")
  .matches(/^[a-zA-Z\s'-]+$/)
  .withMessage(
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  )
  .escape();

const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail()
  .isLength({ max: 50 })
  .withMessage("Email must be less than 50 characters")
  .custom(async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email is already in use");
    }
  });

const passwordValidation = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6, max: 20 })
  .withMessage("Password must be 6-20 characters")
  .matches(passwordPattern)
  .withMessage(
    "Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character"
  )
  .custom((password, { req }) => {
    if (password === req.body.email) {
      throw new Error("Password cannot be the same as your email");
    }
    if (password.toLowerCase().includes("password")) {
      throw new Error('Password cannot contain the word "password"');
    }
    return true;
  });

const loginEmailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail();

const loginPasswordValidation = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required");

// Validation chains
const validateUserRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const validateUserLogin = [loginEmailValidation, loginPasswordValidation];

module.exports = {
  validateUserRegister,
  validateUserLogin,
};
