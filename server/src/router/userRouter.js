const { getAllUsers, registerUser, getSingalUser, updateUser, userDelete, handelAdminUpdateUser } = require('../controller/userController')
const { isLoggedOut, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserRegister } = require('../validators/auth')

const userRouter = require('express').Router()


userRouter.post('/register', isLoggedOut, validateUserRegister, runValidation, registerUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getSingalUser)
userRouter.put('/:id', updateUser)
userRouter.put('/manage-state/:id',isSuperAdmin, handelAdminUpdateUser)



module.exports = userRouter