const { createVillage, getVillagesInUnion, UpdateVillagesInUnion } = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/', validateName, runValidation, isLoggedIn, isSuperAdmin, createVillage)
villageRoutes.get('/:id', getVillagesInUnion)


module.exports = villageRoutes