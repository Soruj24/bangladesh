const {
    addUser,
    populationGetAllUsers,
    populationGetSingalUser,
    populationUpdateUser,
    populationUserDelete,
    populationHandelAdminUpdateUser
} = require('../controller/populationController')

const { isLoggedOut, isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/auth')
const upload = require('../middleware/imageUploader')

const populationRoute = require('express').Router()


populationRoute.post('/', upload.single('image'), isLoggedIn, isAdmin, addUser)
populationRoute.get('/', populationGetAllUsers)
populationRoute.get('/:id', isLoggedIn, populationGetSingalUser)
populationRoute.put('/:id', isLoggedIn, populationUpdateUser)
populationRoute.delete('/:id', isLoggedIn, isSuperAdmin, populationUserDelete)
populationRoute.put('/manage-state/:id', isLoggedIn, isSuperAdmin, populationHandelAdminUpdateUser)



module.exports = populationRoute