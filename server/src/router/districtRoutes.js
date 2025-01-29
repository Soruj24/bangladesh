const { createDistrict, getDistrictsInDivision, singalDistrict, handelDistrictDelete, handelDistrictUpdate, handelGetDistrict, handelGetAllDistricts, handelSingalDistrict, handelDistrictWithOutDivision } = require('../controller/districtController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const districtRoutes = require('express').Router()

districtRoutes.post('/:divisionId', isLoggedIn, isSuperAdmin, validateName, runValidation, createDistrict)
districtRoutes.get('/:divisionId', isLoggedIn, handelGetAllDistricts)
districtRoutes.get('/:divisionId/:districtId', isLoggedIn, handelSingalDistrict)
districtRoutes.delete('/:districtId', isLoggedIn, isSuperAdmin, handelDistrictDelete)
districtRoutes.put('/:districtId', isLoggedIn, handelDistrictUpdate)
districtRoutes.get("/", isLoggedIn, handelDistrictWithOutDivision)

module.exports = districtRoutes

