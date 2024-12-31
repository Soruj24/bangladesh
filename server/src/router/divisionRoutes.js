const { handelCreateDivision, handelGetAllDivisions, handelDeleteDivision, handelUpdateDivision, handelGetSingleDivision } = require('../controller/divisionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const divisionRoutes = require('express').Router()

divisionRoutes.post('/', handelCreateDivision)
divisionRoutes.get('/', handelGetAllDivisions)
divisionRoutes.delete('/:divisionId', handelDeleteDivision)
divisionRoutes.put('/:divisionId', handelUpdateDivision)
divisionRoutes.get('/:divisionId', handelGetSingleDivision)



module.exports = divisionRoutes