const { createVillage, getVillagesInUnion, UpdateVillagesInUnion, handelGetAllVillage, handelDeleteVillage, handelUpdateVillage, handelSinglalVillage } = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/:divisionId/:districtId/:upazilaId/:unionId', createVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId', handelGetAllVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId/:villageId', handelSinglalVillage)
villageRoutes.delete('/:divisionId/:districtId/:upazilaId/:unionId/:villageId', handelDeleteVillage)
villageRoutes.put('/:divisionId/:districtId/:upazilaId/:unionId/:villageId', handelUpdateVillage)


module.exports = villageRoutes