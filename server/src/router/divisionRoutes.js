const { handelCreateDivision, handelGetAllDivisions, handelDeleteDivision, handelUpdateDivision, handelGetSingleDivision } = require('../controller/divisionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const divisionRoutes = require('express').Router()

divisionRoutes.post('/',validateName, runValidation, isLoggedIn, isSuperAdmin,  handelCreateDivision)
divisionRoutes.get('/', handelGetAllDivisions)
divisionRoutes.delete('/:id', validateName, runValidation, isLoggedIn, isSuperAdmin, handelDeleteDivision)
divisionRoutes.put('/:id',validateName, runValidation, isLoggedIn, isSuperAdmin, handelUpdateDivision)
divisionRoutes.get('/:id',  handelGetSingleDivision)



module.exports = divisionRoutes