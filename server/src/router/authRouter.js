const { handelLogIn, handelLogOut } = require('../controller/authController')
const { isLoggedOut, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserLogin } = require('../validators/auth')

const authRouter = require('express').Router()

authRouter.post('/login',isLoggedOut, validateUserLogin, runValidation,  handelLogIn)
authRouter.post('/logout', isLoggedIn, handelLogOut)


module.exports = authRouter