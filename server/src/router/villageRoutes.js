const { createVillage, getVillagesInUnion, UpdateVillagesInUnion, handelGetAllVillage, handelDeleteVillage, handelUpdateVillage } = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/', validateName, runValidation, isLoggedIn, isSuperAdmin, createVillage)
villageRoutes.get('/:id', getVillagesInUnion)
villageRoutes.get('/', handelGetAllVillage)
villageRoutes.delete('/:id',validateName, runValidation, isLoggedIn, isSuperAdmin, handelDeleteVillage)
villageRoutes.put('/:id',validateName, runValidation, isLoggedIn, isSuperAdmin, handelUpdateVillage)


module.exports = villageRoutes