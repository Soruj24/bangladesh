const { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila } = require('../controller/upazilaController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const upazilaRoutes = require('express').Router()


upazilaRoutes.post('/',   handelCreateUpazila)
upazilaRoutes.get('/', handelGetAllUpazila)
upazilaRoutes.get('/:id', handelGetSingleUpazila)
upazilaRoutes.put('/:id', handelUpdateUpazila)
upazilaRoutes.delete('/:id', handelDeleteUpazila)

module.exports = upazilaRoutes