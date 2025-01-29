const {
    createVillage,
    handelGetAllVillage,
    handelDeleteVillage,
    handelUpdateVillage,
    handelSinglalVillage,
    handelGetAllVillageWithOut
} = require('../controller/villageController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const villageRoutes = require('express').Router()



villageRoutes.post('/:divisionId/:districtId/:upazilaId/:unionId', isLoggedIn, isSuperAdmin, validateName, runValidation, createVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId', isLoggedIn, handelGetAllVillage)
villageRoutes.get('/:divisionId/:districtId/:upazilaId/:unionId/:villageId', isLoggedIn, handelSinglalVillage)
villageRoutes.delete('/:villageId', isLoggedIn, isSuperAdmin, handelDeleteVillage)
villageRoutes.put('/:villageId', isLoggedIn, isSuperAdmin, handelUpdateVillage)
villageRoutes.get("/villagesWithOutUnion", isLoggedIn, handelGetAllVillageWithOut)

module.exports = villageRoutes