const { handelLogIn, handelLogOut, handelRefreshToken, handelProtected } = require('../controller/authController')
const { isLoggedOut, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserLogin } = require('../validators/userValidators')

const authRouter = require('express').Router()

authRouter.post('/login', isLoggedOut, validateUserLogin, runValidation, handelLogIn)
authRouter.post('/logout', handelLogOut)
authRouter.post('/refresh-token', handelRefreshToken)
authRouter.get('/protected', isLoggedIn, handelProtected)


module.exports = authRouter