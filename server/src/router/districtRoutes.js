const { createDistrict, getDistrictsInDivision, singalDistrict, handelDistrictDelete, handelDistrictUpdate, handelGetDistrict } = require('../controller/districtController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const districtRoutes = require('express').Router()

districtRoutes.post('/',    createDistrict)
districtRoutes.get('/:divisionId', getDistrictsInDivision)
districtRoutes.get('/', handelGetDistrict)
districtRoutes.get('/:division/:districtId', singalDistrict)
districtRoutes.delete('/:division/:districtId',  handelDistrictDelete)
districtRoutes.put('/:division/:districtId',  handelDistrictUpdate)

module.exports = districtRoutes

