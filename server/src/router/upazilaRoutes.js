const { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila } = require('../controller/upazilaController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const upazilaRoutes = require('express').Router()


upazilaRoutes.post('/',validateName, runValidation, isLoggedIn, isSuperAdmin, handelCreateUpazila)
upazilaRoutes.get('/', handelGetAllUpazila)
upazilaRoutes.get('/:id', handelGetSingleUpazila)
upazilaRoutes.put('/:id',validateName, runValidation, isLoggedIn, isSuperAdmin, handelUpdateUpazila)
upazilaRoutes.delete('/:id',validateName, runValidation, isLoggedIn, isSuperAdmin, handelDeleteUpazila)

module.exports = upazilaRoutes