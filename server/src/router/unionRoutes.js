const { handelCreateUnion, handelGetUnionsInUpazila, handelGetUnions, handleUpdateUnion, handelUnionDelete } = require('../controller/unionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const unionRoutes = require('express').Router()

unionRoutes.post('/',validateName, runValidation, isLoggedIn, isSuperAdmin,   handelCreateUnion)
unionRoutes.get("/:upazilaId", handelGetUnionsInUpazila)
unionRoutes.get("/", handelGetUnions)
unionRoutes.delete("/:id",validateName, runValidation, isLoggedIn, isSuperAdmin, handelUnionDelete)
unionRoutes.put("/:id",validateName, runValidation, isLoggedIn, isSuperAdmin, handleUpdateUnion)



module.exports = unionRoutes