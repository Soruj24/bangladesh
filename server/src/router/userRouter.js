const { getAllUsers,  getSingalUser, updateUser, userDelete, handelAdminUpdateUser, handelUserCreate } = require('../controller/userController')
const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateUserRegister } = require('../validators/userValidators')

const userRouter = require('express').Router()


userRouter.post('/register', isLoggedOut, validateUserRegister, runValidation, handelUserCreate)
userRouter.get('/',isLoggedIn,isAdmin, getAllUsers)
userRouter.get('/:id',isLoggedIn, getSingalUser)
userRouter.put('/:id',isLoggedIn,isAdmin, updateUser)
userRouter.delete('/:id',isLoggedIn,isAdmin, userDelete)
userRouter.put('/manage-state/:id',isLoggedIn, handelAdminUpdateUser)



module.exports = userRouter