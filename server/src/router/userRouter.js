const { getAllUsers, registerUser, getSingalUser, updateUser, userDelete, handelAdminUpdateUser } = require('../controller/userController')
const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserRegister } = require('../validators/auth')

const userRouter = require('express').Router()


userRouter.post('/register', isLoggedOut, validateUserRegister, runValidation, registerUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getSingalUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', userDelete)
userRouter.put('/manage-state/:id', handelAdminUpdateUser)



module.exports = userRouter