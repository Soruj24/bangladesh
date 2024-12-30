const { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila } = require('../controller/upazilaController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const upazilaRoutes = require('express').Router()


upazilaRoutes.post('/', handelCreateUpazila)
upazilaRoutes.get('/', handelGetAllUpazila)
upazilaRoutes.get('/:divisionId/:districtId/:upazilaId', handelGetSingleUpazila)
upazilaRoutes.put('/:divisionId/:districtId/:upazilaId', handelUpdateUpazila)
upazilaRoutes.delete('/:divisionId/:districtId/:upazilaId', handelDeleteUpazila)

module.exports = upazilaRoutes