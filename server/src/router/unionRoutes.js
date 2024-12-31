const { handelCreateUnion, handelGetUnionsInUpazila, handelGetUnions, handleUpdateUnion, handelUnionDelete, handelGetSingleUnion } = require('../controller/unionController')
const { isLoggedIn, isSuperAdmin } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const unionRoutes = require('express').Router()

unionRoutes.post('/:divisionId/:districtId/:upazilaId', handelCreateUnion)
unionRoutes.get("/:divisionId/:districtId/:upazilaId", handelGetUnions)
unionRoutes.get("/:divisionId/:districtId/:upazilaId/:unionId", handelGetSingleUnion)
unionRoutes.delete("/:divisionId/:districtId/:upazilaId/:unionId", handelUnionDelete)
unionRoutes.put("/:divisionId/:districtId/:upazilaId/:unionId", handleUpdateUnion)



module.exports = unionRoutes