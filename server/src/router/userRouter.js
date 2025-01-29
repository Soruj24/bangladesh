const { getAllUsers, registerUser, getSingalUser, updateUser, userDelete, handelAdminUpdateUser } = require('../controller/userController')
const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserRegister } = require('../validators/auth')

const userRouter = require('express').Router()


userRouter.post('/register', isLoggedOut, validateUserRegister, runValidation, registerUser)
userRouter.get('/',isLoggedIn,isAdmin, getAllUsers)
userRouter.get('/:id',isLoggedIn, getSingalUser)
userRouter.put('/:id',isLoggedIn,isAdmin, updateUser)
userRouter.delete('/:id',isLoggedIn,isAdmin, userDelete)
userRouter.put('/manage-state/:id',isLoggedIn, handelAdminUpdateUser)



module.exports = userRouter