const { createDistrict, getDistrictsInDivision, singalDistrict, handelDistrictDelete, handelDistrictUpdate, handelGetDistrict, handelGetAllDistricts, handelSingalDistrict, handelDistrictWithOutDivision } = require('../controller/districtController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const districtRoutes = require('express').Router()

districtRoutes.post('/:divisionId', createDistrict)
districtRoutes.get('/:divisionId', handelGetAllDistricts)
districtRoutes.get('/:divisionId/:districtId', handelSingalDistrict)
districtRoutes.delete('/:districtId', handelDistrictDelete)
districtRoutes.put('/:districtId', handelDistrictUpdate)
districtRoutes.get("/",handelDistrictWithOutDivision)

module.exports = districtRoutes

