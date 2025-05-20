const { body } = require("express-validator");
const validateName = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters"),
];

module.exports = {
  validateName,
};
