const { handelCreateUnionInUpazila, handelGetUnions, handleUpdateUnion, handelUnionDelete, handelGetSingleUnion, handelGetAllUnions } = require('../controller/unionController')

const unionRoutes = require('express').Router()

unionRoutes.post("/:divisionId/:districtId/:upazilaId", handelCreateUnionInUpazila)
unionRoutes.get("/:divisionId/:districtId/:upazilaId", handelGetUnions)
unionRoutes.get("/:divisionId/:districtId/:upazilaId/:unionId", handelGetSingleUnion)
unionRoutes.delete("/:unionId", handelUnionDelete)
unionRoutes.put("/:unionId", handleUpdateUnion)
unionRoutes.get("/", handelGetAllUnions)

module.exports = unionRoutes
