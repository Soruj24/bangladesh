const { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila, handelGetAllUpazilaWithOutDistrict } = require('../controller/upazilaController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const upazilaRoutes = require('express').Router()


upazilaRoutes.post('/:divisionId/:districtId', handelCreateUpazila)
upazilaRoutes.get('/:divisionId/:districtId', handelGetAllUpazila)
upazilaRoutes.get('/:divisionId/:districtId/:upazilaId', handelGetSingleUpazila)
upazilaRoutes.put('/:upazilaId', handelUpdateUpazila)
upazilaRoutes.delete('/:upazilaId', handelDeleteUpazila)
upazilaRoutes.get("/",handelGetAllUpazilaWithOutDistrict)

module.exports = upazilaRoutes