const { createVillage, getVillagesInUnion, UpdateVillagesInUnion, handelGetAllVillage, handelDeleteVillage, handelUpdateVillage, handelSinglalVillage, handelGetAllVillageWithOut } = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/:divisionId/:districtId/:upazilaId/:unionId', createVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId', handelGetAllVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId/:villageId', handelSinglalVillage)
villageRoutes.delete('/:villageId', handelDeleteVillage)
villageRoutes.put('/:villageId', handelUpdateVillage)
villageRoutes.get("/villagesWithOutUnion",handelGetAllVillageWithOut)

module.exports = villageRoutes