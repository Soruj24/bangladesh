const {
    handelCreateUnionInUpazila,
    handelGetUnions,
    handleUpdateUnion,
    handelUnionDelete,
    handelGetSingleUnion,
    handelGetAllUnions
} = require('../controller/unionController')
const { isSuperAdmin, isLoggedIn } = require('../middleware/auth')
const { runValidation } = require('../validators')
const { validateName } = require('../validators/division')

const unionRoutes = require('express').Router()

unionRoutes.post("/:divisionId/:districtId/:upazilaId",isSuperAdmin,validateName,runValidation, handelCreateUnionInUpazila)
unionRoutes.get("/:divisionId/:districtId/:upazilaId", isLoggedIn,handelGetUnions)
unionRoutes.get("/:divisionId/:districtId/:upazilaId/:unionId", isLoggedIn,handelGetSingleUnion)
unionRoutes.delete("/:unionId",isLoggedIn,isSuperAdmin, handelUnionDelete)
unionRoutes.put("/:unionId",isLoggedIn,isSuperAdmin, handleUpdateUnion)
unionRoutes.get("/",isLoggedIn, handelGetAllUnions)

module.exports = unionRoutes
