const { handelCreateUnion, handelGetUnionsInUpazila, handelGetUnions } = require('../controller/unionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const unionRoutes = require('express').Router()

unionRoutes.post('/', validateName, runValidation,  handelCreateUnion)
unionRoutes.get("/:upazilaId", handelGetUnionsInUpazila)
unionRoutes.get("/:upazilaId/:unionId", handelGetUnions)

module.exports = unionRoutes