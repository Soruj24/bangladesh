const {
  handelGetAllDistricts,
  handelDistrictWithOutDivision,
  handelCreateDistrict,
  handelSingalDistrictWithOutDivision,
  handelDeleteDistrictWithOutDivision,
  handelUpdateDistrictWithOutDivision,
  handelSingalDistrictInDivision,
} = require("../controller/districtController");
const { isLoggedIn, isSuperAdmin } = require("../middleware/auth");
const { runValidation } = require("../validators");
const { validateName } = require("../validators/division");

const districtRoutes = require("express").Router();

districtRoutes.get("/", isLoggedIn, handelDistrictWithOutDivision);
districtRoutes.get("/:divisionId/:districtId", isLoggedIn, handelSingalDistrictInDivision);
districtRoutes.get("/:divisionId", isLoggedIn, handelGetAllDistricts);
districtRoutes.post("/:divisionId", isLoggedIn, isSuperAdmin, validateName, runValidation, handelCreateDistrict);
districtRoutes.delete("/:districtId", isLoggedIn, isSuperAdmin, handelDeleteDistrictWithOutDivision);
districtRoutes.put("/:districtId", isLoggedIn, handelUpdateDistrictWithOutDivision);
districtRoutes.get("/:districtId", isLoggedIn, handelSingalDistrictWithOutDivision);

module.exports = districtRoutes;
