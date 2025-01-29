const { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila, handelGetAllUpazilaWithOutDistrict } = require('../controller/upazilaController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const upazilaRoutes = require('express').Router()


upazilaRoutes.post('/:divisionId/:districtId', isLoggedIn, isSuperAdmin, validateName, runValidation, handelCreateUpazila)
upazilaRoutes.get('/:divisionId/:districtId', isLoggedIn, handelGetAllUpazila)
upazilaRoutes.get('/:divisionId/:districtId/:upazilaId', isLoggedIn, isSuperAdmin, handelGetSingleUpazila)
upazilaRoutes.put('/:upazilaId', isLoggedIn, handelUpdateUpazila)
upazilaRoutes.delete('/:upazilaId', isLoggedIn, isSuperAdmin, handelDeleteUpazila)
upazilaRoutes.get("/withOutDistrict", isLoggedIn, handelGetAllUpazilaWithOutDistrict)

module.exports = upazilaRoutes