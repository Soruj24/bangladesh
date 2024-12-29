const { createVillage, getVillagesInUnion, UpdateVillagesInUnion, handelGetAllVillage, handelDeleteVillage, handelUpdateVillage } = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/', createVillage)
villageRoutes.get('/:id', getVillagesInUnion)
villageRoutes.get('/', handelGetAllVillage)
villageRoutes.delete('/:id', handelDeleteVillage)
villageRoutes.put('/:id', handelUpdateVillage)


module.exports = villageRoutes