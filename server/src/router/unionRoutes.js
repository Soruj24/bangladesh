const { handelCreateUnion, handelGetUnionsInUpazila, handelGetUnions, handleUpdateUnion, handelUnionDelete, handelGetSingleUnion } = require('../controller/unionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const unionRoutes = require('express').Router()

unionRoutes.post('/', handelCreateUnion)
unionRoutes.get("/", handelGetUnions)
unionRoutes.get("/:divisionId/:districtId/:upazilaId/:upazilaId", handelGetSingleUnion)
unionRoutes.delete("/:divisionId/:districtId/:upazilaId/:upazilaId", handelUnionDelete)
unionRoutes.put("/:divisionId/:districtId/:upazilaId/:upazilaId", handleUpdateUnion)



module.exports = unionRoutes