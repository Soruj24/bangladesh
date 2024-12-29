const { addUser, populationGetAllUsers, populationGetSingalUser, populationUpdateUser, populationUserDelete, populationHandelAdminUpdateUser } = require('../controller/populationController')
const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')

const populationRoute = require('express').Router()


populationRoute.post('/', addUser)
populationRoute.get('/', populationGetAllUsers)
populationRoute.get('/:id', populationGetSingalUser)
populationRoute.put('/:id', populationUpdateUser)
populationRoute.delete('/:id', populationUserDelete)
populationRoute.put('/manage-state/:id', populationHandelAdminUpdateUser)



module.exports = populationRoute