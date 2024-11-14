const { createDistrict, getDistrictsInDivision, singalDistrict, handelDistrictDelete, handelDistrictUpdate } = require('../controller/districtController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const districtRoutes = require('express').Router()

districtRoutes.post('/', validateName, runValidation,  createDistrict)
districtRoutes.get('/:divisionId', getDistrictsInDivision)
districtRoutes.get('/:divisionId/:districtId', singalDistrict)
districtRoutes.delete('/:divisionId/:districtId',  handelDistrictDelete)
districtRoutes.put('/:divisionId/:districtId', validateName, runValidation, handelDistrictUpdate)

module.exports = districtRoutes