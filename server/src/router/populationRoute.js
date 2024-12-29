const { addUser } = require('../controller/populationController')
const { getAllUsers, registerUser, getSingalUser, updateUser, userDelete, handelAdminUpdateUser } = require('../controller/userController')
const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')
const protectRoute = require('../middleware/protectRoute')
const { runValidation } = require('../validators')
const { validateUserRegister } = require('../validators/auth')

const populationRoute = require('express').Router()


populationRoute.post('/', addUser)
populationRoute.get('/', getAllUsers)
populationRoute.get('/:id', getSingalUser)
populationRoute.put('/:id', updateUser)
populationRoute.delete('/:id', userDelete)
populationRoute.put('/manage-state/:id', isSuperAdmin, handelAdminUpdateUser)



module.exports = populationRoute