// register validation
const { body } = require('express-validator');
const validateUserRegister = [

    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required. Enter a valid name')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required. Enter a valid email')
    .isEmail()
    .withMessage('Please enter a valid email'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required. Enter a valid password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 20 })
    .withMessage('Password must be at most 20 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),

    body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required. Enter a valid phone number')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),

 

]
const validateUserLogin = [


    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required. Enter a valid email')
    .isEmail()
    .withMessage('Please enter a valid email'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required. Enter a valid password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 20 })
    .withMessage('Password must be at most 20 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),

]
 


module.exports = {
    validateUserRegister,
    validateUserLogin,
  
}