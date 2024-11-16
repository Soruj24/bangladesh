const { createDistrict, getDistrictsInDivision, singalDistrict, handelDistrictDelete, handelDistrictUpdate, handelGetDistrict } = require('../controller/districtController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const districtRoutes = require('express').Router()

districtRoutes.post('/', validateName, runValidation, isLoggedIn, isSuperAdmin, createDistrict)
districtRoutes.get('/:divisionId', getDistrictsInDivision)
districtRoutes.get('/', handelGetDistrict)
districtRoutes.get('/:divisionId/:districtId', singalDistrict)
districtRoutes.delete('/:districtId',validateName, runValidation, isLoggedIn, isSuperAdmin, handelDistrictDelete)
districtRoutes.put('/:districtId', validateName, runValidation, isLoggedIn, isSuperAdmin, handelDistrictUpdate)

module.exports = districtRoutes